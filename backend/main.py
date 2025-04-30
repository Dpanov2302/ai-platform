from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
import io

app = FastAPI()

# Настраиваем CORS (для локального dev и docker)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # На проде лучше ограничить
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- МОДЕЛИ ЗАПРОСОВ -----
class TextRequest(BaseModel):
    input_text: str


class TextToImageRequest(BaseModel):
    prompt: str
    negative_prompt: str | None = None


# ----- ROUTES -----

# Текст -> текст (пример для text2text модели)
@app.post("/text-to-text")
def handle_text_to_text(req: TextRequest):
    try:
        # Прокидываем запрос в model-text2text
        response = requests.post(
            "http://model-text2text:8503/generate",
            json={"input_text": req.input_text},
            timeout=120
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка text2text model: {e}")


# Текст -> изображение (Kandinsky)
@app.post("/text-to-image")
def handle_text_to_image(req: TextToImageRequest):
    try:
        payload = {
            "prompt": req.prompt,
            "negative_prompt": req.negative_prompt or "low quality, bad quality"
        }
        response = requests.post(
            "http://model-kandinsky:8502/generate",
            json=payload,
            timeout=300  # ген может быть долгим
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка Kandinsky model: {e}")


@app.post("/classify-image")
def classify_image(file: UploadFile = File(...)):
    try:
        files = {"file": (file.filename, file.file, file.content_type)}
        response = requests.post("http://models-onnx:8504/classify", files=files)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ONNX classify: {e}")


@app.post("/detect-image")
def detect_image(file: UploadFile = File(...)):
    try:
        files = {"file": (file.filename, file.file, file.content_type)}
        response = requests.post("http://models-onnx:8504/detect", files=files)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ONNX detect: {e}")


@app.post("/detect-image-annotated")
def detect_image_annotated(file: UploadFile = File(...)):
    try:
        files = {"file": (file.filename, file.file, file.content_type)}
        response = requests.post("http://models-onnx:8504/detect-image-annotated", files=files)
        response.raise_for_status()

        return StreamingResponse(
            io.BytesIO(response.content),
            media_type=response.headers.get("Content-Type", "image/jpeg")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ONNX detect annotated: {e}")


@app.get("/")
def root():
    return {"message": "AI Platform backend is running"}
