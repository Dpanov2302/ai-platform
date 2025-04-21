from fastapi import FastAPI
from pydantic import BaseModel
from diffusers import AutoPipelineForText2Image
import torch
from io import BytesIO
import base64

app = FastAPI()
pipe = None  # инициализируем позже


class PromptRequest(BaseModel):
    prompt: str
    negative_prompt: str = "low quality, bad quality"


@app.on_event("startup")
def load_model():
    global pipe
    pipe = AutoPipelineForText2Image.from_pretrained(
        "kandinsky-community/kandinsky-2-1"
    )
    pipe.to("cpu")
    pipe.enable_model_cpu_offload()


@app.post("/generate")
def generate_image(req: PromptRequest):
    global pipe

    image = pipe(
        prompt=req.prompt,
        negative_prompt=req.negative_prompt,
        height=384,
        width=384,
        prior_guidance_scale=1.0,
        num_inference_steps=15
    ).images[0]

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    base64_img = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return {"image_base64": base64_img}
