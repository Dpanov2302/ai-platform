from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import logging

app = FastAPI()
logger = logging.getLogger("uvicorn.error")

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
@app.on_event("startup")
def load_models():
    for name, hf_id in MODEL_REGISTRY.items():
        try:
            logger.info(f"Начало загрузки модели '{name}' из {hf_id}...")

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
        except Exception as e:
            logger.error(f"Не удалось загрузить модель '{name}': {e}")

# ----- ОБРАБОТКА ЗАПРОСОВ -----
@app.post("/generate")
async def generate_text(req: TextRequest):
    if len(req.input_text) > 1000:
        raise HTTPException(status_code=400, detail="Слишком длинный ввод (макс 1000 символов)")

    pipe = loaded_pipelines.get(req.model_name)
    if not pipe:
        raise HTTPException(status_code=400, detail="Модель не найдена")

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
