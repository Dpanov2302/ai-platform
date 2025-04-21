from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests

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

# Можно добавить другие endpoints, например для сегментации и т.п.

@app.get("/")
def root():
    return {"message": "AI Platform backend is running"}
