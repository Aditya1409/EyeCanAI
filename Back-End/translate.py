from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from googletrans import Translator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    target_lang: str  

translator = Translator()

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        translated = translator.translate(request.text, dest=request.target_lang)
        return {"translated": translated.text}
    except Exception as e:
        return {"error": str(e)}
