import io

import httpx
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

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
async def generate_text(req: TextRequest):
    try:
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                "http://model-text2text:8503/generate",
                json={"input_text": req.input_text},
            )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Ошибка text2text model: {e}")


@app.post("/classify-image")
async def classify_image(file: UploadFile = File(...)):
    try:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post("http://models-onnx:8504/classify", files=files)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ONNX classify: {e}")


@app.post("/detect-image")
async def detect_image(file: UploadFile = File(...)):
    try:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post("http://models-onnx:8504/detect-image", files=files)
        response.raise_for_status()

        return StreamingResponse(
            io.BytesIO(response.content),
            media_type=response.headers.get("Content-Type", "image/jpeg"),
        )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ONNX detect: {e}")


@app.get("/")
async def root():
    return {"message": "AI Platform backend is running"}
