# models-onnx/inference/detect.py
import numpy as np
import cv2
import io
from fastapi import UploadFile
from fastapi.responses import StreamingResponse
import onnxruntime as ort
from .resources.coco_classes import COCO_CLASSES


def load_model(path: str) -> ort.InferenceSession:
    return ort.InferenceSession(path)


async def detect_and_annotate(session: ort.InferenceSession, file: UploadFile):
    image_bytes = await file.read()
    img_np = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

    orig_h, orig_w = img.shape[:2]
    img_resized = cv2.resize(img, (640, 640))
    img_input = img_resized.astype(np.float16) / 255.0
    img_input = np.transpose(img_input, (2, 0, 1))[np.newaxis, :]

    input_name = session.get_inputs()[0].name
    output = session.run(None, {input_name: img_input})[0][0]

    boxes, confidences, class_ids = [], [], []

    for row in output:
        conf = row[4]
        if conf > 0.4:
            class_id = int(np.argmax(row[5:]))
            xc, yc, w, h = row[:4]
            scale_x, scale_y = orig_w / 640, orig_h / 640
            x1 = int((xc - w / 2) * scale_x)
            y1 = int((yc - h / 2) * scale_y)
            box_w, box_h = int(w * scale_x), int(h * scale_y)

            boxes.append([x1, y1, box_w, box_h])
            confidences.append(float(conf))
            class_ids.append(class_id)

    indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.4, 0.5)
    indices = [] if len(indices) == 0 else indices.flatten()

    for i in indices:
        x, y, w, h = boxes[i]
        label = COCO_CLASSES[class_ids[i]] if class_ids[i] < len(COCO_CLASSES) else f"id {class_ids[i]}"
        conf = confidences[i]
        text = f"{label} ({conf:.2f})"
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cv2.putText(img, text, (x, max(y - 10, 10)), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 2)

    _, img_encoded = cv2.imencode(".jpg", img)
    return StreamingResponse(io.BytesIO(img_encoded.tobytes()), media_type="image/jpeg")
