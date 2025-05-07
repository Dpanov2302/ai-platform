# models-onnx/inference/classify.py
import numpy as np
import cv2
from fastapi import UploadFile
import onnxruntime as ort

from .resources.imagenet_classes import IMAGENET_CLASSES

def load_model(path: str) -> ort.InferenceSession:
    return ort.InferenceSession(path)

async def predict(session: ort.InferenceSession, file: UploadFile):
    image_bytes = await file.read()
    img_np = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224))
    img = img.astype(np.float32) / 255.0
    img = img[np.newaxis, :]  # NHWC: (1, 224, 224, 3)

    input_name = session.get_inputs()[0].name
    output = session.run(None, {input_name: img})[0][0]  # [1, 1000] -> [1000]

    # Получаем топ-5 предсказаний
    top5_indices = np.argsort(output)[::-1][:5]
    top5 = [
        {"class_id": int(i), "class_name": IMAGENET_CLASSES[i], "probability": float(output[i])}
        for i in top5_indices
    ]

    return {"predictions": top5}
