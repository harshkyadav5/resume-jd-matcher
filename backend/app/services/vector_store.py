import chromadb
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_DIR = BASE_DIR / "chroma_db"

client = chromadb.Client(
    settings=chromadb.Settings(
        persist_directory=str(DB_DIR),
        anonymized_telemetry=False
    )
)

collection = client.get_or_create_collection(name="resumes")

def get_collection():
    return collection
