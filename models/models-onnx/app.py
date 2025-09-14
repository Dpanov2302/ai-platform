from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from inference import classify, detect

app = FastAPI()
logger = logging.getLogger("uvicorn.error")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions = {}

MODEL_REGISTRY = {
    "efficientnet": ("models/efficientnet-lite4-11-qdq.onnx", classify.load_model),
    "yolov5": ("models/yolov5n.onnx", detect.load_model),
}


def get_session(name: str):
    session = sessions.get(name)
    if session:
        return session

    model_info = MODEL_REGISTRY.get(name)
    if not model_info:
        raise HTTPException(status_code=400, detail="Модель не найдена")

    path, loader = model_info
    try:
        logger.info(f"Загрузка модели '{name}' из {path}...")
        session = loader(path)
        sessions[name] = session
        logger.info(f"Модель '{name}' загружена.")
        return session
    except Exception as e:
        logger.error(f"Не удалось загрузить модель '{name}': {e}")
        raise HTTPException(status_code=500, detail="Ошибка при загрузке модели")

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    try:
        session = get_session("efficientnet")
        predictions = await classify.predict(session, file)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-image")
async def detect_image(file: UploadFile = File(...)):
    try:
        session = get_session("yolov5")
        return await detect.detect_and_annotate(session, file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "ONNX model server is running"}