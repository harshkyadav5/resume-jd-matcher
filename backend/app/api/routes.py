from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from uuid import uuid4
from pathlib import Path
import shutil
import uuid

from pydantic import BaseModel

from app.services.pdf_loader import extract_text_per_page
from app.services.chunker import chunk_pages, chunk_text
from app.services.indexer import index_resume_chunks
from app.services.matcher import match_resume_with_jd
from app.services.skill_matcher import compare_skills
from app.services.prompt_builder import build_feedback_prompt
from app.services.llm import generate_feedback

router = APIRouter(prefix="/api")

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads" / "resumes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF, DOCX, TXT allowed."
        )

    resume_id = str(uuid4())
    safe_name = f"{resume_id}_{file.filename}"
    save_path = UPLOAD_DIR / safe_name
    
    with save_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pages = extract_text_per_page(save_path)
    chunks = chunk_pages(pages)

    if not chunks:
        raise HTTPException(400, "No readable content found in resume")

    index_resume_chunks(chunks, resume_id)

    return {
        "message": "Resume uploaded and indexed successfully",
        "resume_id": resume_id,
        "num_pages": len(pages),
        "num_chunks": len(chunks)
    }


class JDRequest(BaseModel):
    text: str


@router.post("/upload-jd")
async def upload_jd(payload: JDRequest):
    if not payload.text.strip():
        raise HTTPException(400, "JD text cannot be empty")

    chunks = chunk_text(payload.text)

    if not chunks:
        raise HTTPException(400, "JD could not be chunked")

    return {
        "message": "JD processed successfully",
        "num_chunks": len(chunks),
        "preview": chunks[:3]
    }


@router.post("/match")
async def match_resume_jd(payload: dict):
    if "resume_chunks" not in payload or "jd_chunks" not in payload:
        raise HTTPException(400, "resume_chunks and jd_chunks are required")

    result = match_resume_with_jd(
        resume_chunks=payload["resume_chunks"],
        jd_chunks=payload["jd_chunks"]
    )

    return {
        "message": "Matching completed",
        "match_percentage": result["final_score"],
        "score_breakdown": result["breakdown"],
        "top_matches": result["top_matches"]
    }


@router.post("/skills")
async def skill_gap_analysis(payload: dict):
    if "jd_text" not in payload or "resume_text" not in payload:
        raise HTTPException(400, "jd_text and resume_text are required")

    result = compare_skills(
        jd_text=payload["jd_text"],
        resume_text=payload["resume_text"]
    )

    return {
        "message": "Skill analysis completed",
        **result
    }


@router.post("/feedback")
async def generate_match_feedback(payload: dict):
    required_fields = [
        "job_title",
        "match_percentage",
        "matched_skills",
        "missing_skills",
        "top_snippets"
    ]

    for field in required_fields:
        if field not in payload:
            raise HTTPException(400, f"{field} is required")

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
    if not resume.filename.lower().endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(400, "Invalid resume file type")

    if not job_description.strip():
        raise HTTPException(400, "Job description cannot be empty")

    resume_id = str(uuid4())
    temp_path = UPLOAD_DIR / f"{resume_id}_{resume.filename}"

    with temp_path.open("wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

    pages = extract_text_per_page(temp_path)
    resume_chunks = chunk_pages(pages)

    if not resume_chunks:
        raise HTTPException(400, "No readable content in resume")

    resume_text = " ".join(c["text"] for c in resume_chunks)

    jd_chunks = chunk_text(job_description)

    if not jd_chunks:
        raise HTTPException(400, "JD could not be processed")

    match_result = match_resume_with_jd(
        resume_chunks=resume_chunks,
        jd_chunks=jd_chunks
    )

    skill_result = compare_skills(
        jd_text=job_description,
        resume_text=resume_text
    )

    prompt = build_feedback_prompt(
        job_title="Software Engineer",
        match_percentage=match_result["final_score"],
        matched_skills=skill_result["matched_skills"],
        missing_skills=skill_result["missing_skills"],
        top_snippets=[m["chunk"]["text"] for m in match_result["top_matches"]]
    )

    feedback = generate_feedback(prompt)

    return {
        "match_percentage": match_result["final_score"],
        "score_breakdown": match_result["breakdown"],
        "top_matches": match_result["top_matches"],
        **skill_result,
        "feedback": feedback
    }
