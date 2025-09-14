from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.post("/generate-text")
def generate_text(req: TextRequest):
    try:
        response = requests.post(
            "http://model-text2text:8503/generate",
            json={"input_text": req.input_text},
            timeout=120
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка text2text model: {e}")


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
        response = requests.post("http://models-onnx:8504/detect-image", files=files)
        response.raise_for_status()

        return StreamingResponse(
            io.BytesIO(response.content),
            media_type=response.headers.get("Content-Type", "image/jpeg")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ONNX detect: {e}")


@app.get("/")
def root():
    return {"message": "AI Platform backend is running"}
