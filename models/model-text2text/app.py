import logging
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM

app = FastAPI()
logger = logging.getLogger("uvicorn.error")

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

# Словарь для хранения загруженных пайплайнов
loaded_pipelines = {}

# Допустимые модели и их HuggingFace ID
MODEL_REGISTRY = {
    "distilgpt2": "distilbert/distilgpt2",
    "falcon-rw-1b": "tiiuae/falcon-rw-1b"
}


# ----- ВХОДНАЯ МОДЕЛЬ -----
class TextRequest(BaseModel):
    input_text: str
    model_name: str = "distilgpt2"


# ----- ЗАГРУЗКА МОДЕЛЕЙ -----
def get_pipeline(name: str):
    pipe = loaded_pipelines.get(name)
    if pipe:
        return pipe

    hf_id = MODEL_REGISTRY.get(name)
    if not hf_id:
        raise HTTPException(status_code=400, detail="Модель не найдена")

    try:
        logger.info(f"Загрузка модели '{name}' из {hf_id}...")
        tokenizer = AutoTokenizer.from_pretrained(hf_id)
        model = AutoModelForCausalLM.from_pretrained(hf_id)
        pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            framework="pt",
            device=-1  # CPU
        )
        loaded_pipelines[name] = pipe
        logger.info(f"Модель '{name}' загружена.")
        return pipe
    except Exception as e:
        logger.error(f"Не удалось загрузить модель '{name}': {e}")
        raise HTTPException(status_code=500, detail="Ошибка при загрузке модели")


# ----- ОБРАБОТКА ЗАПРОСОВ -----
@app.post("/generate")
async def generate_text(req: TextRequest):
    if len(req.input_text) > 1000:
        raise HTTPException(status_code=400, detail="Слишком длинный ввод (макс 1000 символов)")

    pipe = get_pipeline(req.model_name)

    prompt = f"User: {req.input_text}\nAI:"

    try:
        pad_token_id = pipe.tokenizer.pad_token_id or pipe.tokenizer.eos_token_id
        result = pipe(
            prompt,
            max_new_tokens=100,
            do_sample=True,
            temperature=0.8,
            top_k=50,
            pad_token_id=pad_token_id
        )
        output = result[0]["generated_text"].replace(prompt, "").strip()
        return {"response": output}
    except Exception as e:
        logger.error(f"Ошибка генерации текста: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при генерации текста.")
