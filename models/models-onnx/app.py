from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

from inference import classify, detect

app = FastAPI()
logger = logging.getLogger("uvicorn.error")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions = {}

@app.on_event("startup")
def load_models():
    global sessions
    try:
        logger.info("Загрузка моделей...")
        sessions["efficientnet"] = classify.load_model("models/efficientnet-lite4-11-qdq.onnx")
        sessions["yolov5"] = detect.load_model("models/yolov5n.onnx")
        logger.info("Модели загружены")
    except Exception as e:
        raise RuntimeError(f"Ошибка загрузки моделей: {e}")

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    try:
        prediction = await classify.predict(sessions["efficientnet"], file)
        return {"class_id": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-image-annotated")
async def detect_image(file: UploadFile = File(...)):
    try:
        return await detect.detect_and_annotate(sessions["yolov5"], file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "ONNX model server is running"}
