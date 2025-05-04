from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import onnxruntime as ort
import numpy as np
import io
import cv2
import logging

from coco_classes import COCO_CLASSES

app = FastAPI()
logger = logging.getLogger("uvicorn.error")

# CORS (можно ограничить)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Глобальные переменные
sessions = {}


@app.on_event("startup")
def load_models():
    global sessions
    try:
        logger.info("Начало загрузки моделей ONNX")
        sessions["efficientnet"] = ort.InferenceSession("models/efficientnet-lite4-11-qdq.onnx")
        sessions["yolov5"] = ort.InferenceSession("models/yolov5n.onnx")
        logger.info("Модели загружены")
    except Exception as e:
        raise RuntimeError(f"Ошибка загрузки ONNX моделей: {e}")


# 🧠 Классификация изображения
@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img_np = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (224, 224))
        img = img.astype(np.float32) / 255.0
        img = img[np.newaxis, :]  # NHWC: (1, 224, 224, 3)

        input_tensor = sessions["efficientnet"].get_inputs()[0]
        print(f"INPUT NAME: {input_tensor.name}")
        print(f"INPUT SHAPE: {input_tensor.shape}")
        print(f"INPUT TYPE: {input_tensor.type}")

        input_name = input_tensor.name
        output = sessions["efficientnet"].run(None, {input_name: img})[0]
        prediction = int(np.argmax(output))
        logger.info(f"classify/prediction: {prediction}")
        return {"class_id": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка классификации: {e}")


# 🧠 Детекция объектов YOLOv5
@app.post("/detect-image-annotated")
async def detect_image_annotated(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img_np = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

        orig_h, orig_w = img.shape[:2]

        # Подготовка для YOLO
        img_resized = cv2.resize(img, (640, 640))
        img_input = img_resized.astype(np.float16) / 255.0
        img_input = np.transpose(img_input, (2, 0, 1))[np.newaxis, :]

        input_name = sessions["yolov5"].get_inputs()[0].name
        output = sessions["yolov5"].run(None, {input_name: img_input})[0][0]

        boxes = []
        confidences = []
        class_ids = []

        for row in output:
            conf = row[4]
            if conf > 0.4:
                class_id = int(np.argmax(row[5:]))
                xc, yc, w, h = row[:4]

                scale_x = orig_w / 640
                scale_y = orig_h / 640
                x1 = int((xc - w / 2) * scale_x)
                y1 = int((yc - h / 2) * scale_y)
                box_w = int(w * scale_x)
                box_h = int(h * scale_y)

                boxes.append([x1, y1, box_w, box_h])
                confidences.append(float(conf))
                class_ids.append(class_id)

        # Применить NMS
        indices = cv2.dnn.NMSBoxes(boxes, confidences, score_threshold=0.4, nms_threshold=0.5)

        if isinstance(indices, (list, tuple)) and len(indices) == 0:
            indices = []
        else:
            indices = indices.flatten()

        for i in indices:
            x, y, w, h = boxes[i]
            label = COCO_CLASSES[class_ids[i]] if class_ids[i] < len(COCO_CLASSES) else f"id {class_ids[i]}"
            conf = confidences[i]

            text = f"{label} ({conf:.2f})"
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.putText(img, text, (x, max(y - 10, 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 2)

        # Возвращаем изображение
        _, img_encoded = cv2.imencode(".jpg", img)
        return StreamingResponse(io.BytesIO(img_encoded.tobytes()), media_type="image/jpeg")

    except Exception as e:
        import traceback
        print("ERROR in detect_image_annotated:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Ошибка при инференсе и отрисовке: {e}")


@app.get("/")
def root():
    return {"message": "ONNX model server is running"}
