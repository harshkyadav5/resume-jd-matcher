from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from uuid import uuid4
from pathlib import Path
import shutil
import uuid
import numpy as np

from pydantic import BaseModel

from app.services.pdf_loader import extract_text_per_page
from app.services.chunker import chunk_pages, chunk_text
from app.services.indexer import index_resume_chunks
from app.services.embeddings import embed_texts
from app.services.matcher import match_resume_with_jd
from app.services.skill_matcher import compare_skills
from app.services.prompt_builder import build_feedback_prompt
from app.services.llm import generate_feedback
from app.services.vector_store import get_collection

router = APIRouter(prefix="/api")

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads" / "resumes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(
            400,
            "Invalid file type. Only '.pdf', '.txt' and '.docx' files are allowed"
        )

    safe_name = f"{uuid4()}_{file.filename}"
    save_path = UPLOAD_DIR / safe_name
    resume_id = str(uuid4())

    with save_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pages = extract_text_per_page(save_path)
    chunks = chunk_pages(pages)

    index_resume_chunks(chunks, resume_id)

    return {
        "filename": file.filename,
        "path": str(save_path),
        "message": "Resume indexed successfully",
        "num_pages": len(pages),
        "non_empty_pages": sum(1 for p in pages if p.strip()),
        "num_chunks": len(chunks),
        "resume_id": resume_id
    }


class JDRequest(BaseModel):
    text: str


@router.post("/upload-jd")
async def upload_jd(payload: JDRequest):
    if not payload.text.strip():
        raise HTTPException(400, "JD text cannot be empty")

    chunks = chunk_text(payload.text)

    return {
        "message": "JD processed successfully",
        "num_chunks": len(chunks),
        "preview": chunks[:3]
    }


@router.post("/match")
async def match_resume_jd(payload: dict):
    resume_chunks = payload["resume_chunks"]
    jd_chunks = payload["jd_chunks"]

    result = match_resume_with_jd(resume_chunks, jd_chunks)

    return {
        "message": "Matching completed",
        "match_percentage": result["match_score"],
        "top_matches": result["top_matches"]
    }


@router.post("/skills")
async def skill_gap_analysis(payload: dict):
    jd_text = payload["jd_text"]
    resume_text = payload["resume_text"]

    result = compare_skills(jd_text, resume_text)

    return {
        "message": "Skill analysis completed",
        **result
    }


@router.post("/feedback")
async def generate_match_feedback(payload: dict):
    match_percentage = payload["match_percentage"]
    matched_skills = payload["matched_skills"]
    missing_skills = payload["missing_skills"]

    prompt = build_feedback_prompt(
        job_title=payload["job_title"],
        match_percentage=payload["match_percentage"],
        matched_skills=payload["matched_skills"],
        missing_skills=payload["missing_skills"],
        top_snippets=payload["top_snippets"]
    )

    feedback = generate_feedback(prompt)

    return {
        "message": "Feedback generated successfully",
        "feedback": feedback
    }


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    pages = extract_text_per_page(resume.file)
    resume_chunks = chunk_pages(pages)

    texts = [c["text"] for c in resume_chunks]
    embeddings = embed_texts(texts)

    collection = get_collection()
    resume_id = str(uuid.uuid4())

    collection.add(
        documents=texts,
        embeddings=embeddings,
        metadatas=[{"page": c["page"], "chunk_id": c["chunk_id"]} for c in resume_chunks],
        ids=[f"{resume_id}_{i}" for i in range(len(texts))]
    )

    jd_embedding = embed_texts([job_description])[0]

    results = collection.query(
        query_embeddings=[jd_embedding],
        n_results=3
    )

    matches = []
    scores = []

    for i in range(len(results["documents"][0])):
        score = 1 - results["distances"][0][i]
        scores.append(score)

        matches.append({
            "chunk": results["documents"][0][i],
            "score": round(score * 100, 2)
        })

    match_percentage = round(float(np.mean(scores) * 100), 2)

    feedback_prompt = f"""
Job Description:
{job_description}

Resume Match Score: {match_percentage}%

Top Matching Resume Snippets:
{chr(10).join([m['chunk'] for m in matches])}

Provide concise hiring feedback and improvement suggestions.
"""
    feedback = generate_feedback(feedback_prompt)

    return {
        "match_percentage": match_percentage,
        "top_matches": matches,
        "feedback": feedback
    }
