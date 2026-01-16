from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from app.api.routes import router


app = FastAPI(title="Resume JD Matcher")

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok"}
