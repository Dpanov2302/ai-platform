import io
import os

import httpx
from fastapi import Depends, FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()

allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
allowed_origins = (
    [origin.strip() for origin in allowed_origins_env.split(",")]
    if allowed_origins_env
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- LIFESPAN -----


@app.on_event("startup")
async def startup() -> None:
    app.state.client = httpx.AsyncClient()


@app.on_event("shutdown")
async def shutdown() -> None:
    await app.state.client.aclose()


async def get_client() -> httpx.AsyncClient:
    return app.state.client


# ----- МОДЕЛИ ЗАПРОСОВ -----
class TextRequest(BaseModel):
    input_text: str


class TextToImageRequest(BaseModel):
    prompt: str
    negative_prompt: str | None = None


# ----- ROUTES -----


@app.post("/generate-text")
async def generate_text(
    req: TextRequest, client: httpx.AsyncClient = Depends(get_client)
):
    try:
        response = await client.post(
            "http://model-text2text:8503/generate",
            json={"input_text": req.input_text},
            timeout=120,
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Ошибка text2text model: {e}")


@app.post("/classify-image")
async def classify_image(
    file: UploadFile = File(...), client: httpx.AsyncClient = Depends(get_client)
):
    try:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        response = await client.post(
            "http://models-onnx:8504/classify", files=files, timeout=60
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ONNX classify: {e}")


@app.post("/detect-image")
async def detect_image(
    file: UploadFile = File(...), client: httpx.AsyncClient = Depends(get_client)
):
    try:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        response = await client.post(
            "http://models-onnx:8504/detect-image", files=files, timeout=60
        )
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