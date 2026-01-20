from app.services.embeddings import embed_texts
from app.services.similarity import cosine_similarity
from app.services.skill_extractor import extract_skills
import re

def tokenize(text: str) -> set[str]:
    return set(re.findall(r"\b[a-zA-Z]+\b", text.lower()))


def match_resume_with_jd(
    resume_chunks: list[dict],
    jd_chunks: list[dict],
    resume_text: str | None = None,
    jd_text: str | None = None,
    top_k: int = 5
):
    """
    FINAL SCORE =
        50% Semantic (Embeddings)
        35% Skills
        15% Keywords
    """

    resume_texts = [c["text"] for c in resume_chunks]
    jd_texts = [c["text"] for c in jd_chunks]

    resume_embeddings = embed_texts(resume_texts)
    jd_embeddings = embed_texts(jd_texts)

    pair_scores = []

    for r_idx, r_emb in enumerate(resume_embeddings):
        for j_emb in jd_embeddings:
            sim = cosine_similarity(r_emb, j_emb)
            pair_scores.append({
                "chunk": resume_chunks[r_idx],
                "score": sim
            })

    pair_scores.sort(key=lambda x: x["score"], reverse=True)
    top_matches = pair_scores[:top_k]

    embedding_score = sum(m["score"] for m in top_matches) / len(top_matches)

    skill_score = 0.0
    matched_skills = []
    missing_skills = []

    if resume_text and jd_text:
        jd_skills = extract_skills(jd_text)
        resume_skills = extract_skills(resume_text)

        matched_skills = sorted(jd_skills & resume_skills)
        missing_skills = sorted(jd_skills - resume_skills)

        skill_score = (
            len(matched_skills) / len(jd_skills)
            if jd_skills else 0
        )

    keyword_score = 0.0

    if resume_text and jd_text:
        jd_tokens = tokenize(jd_text)
        resume_tokens = tokenize(resume_text)

        keyword_score = (
            len(jd_tokens & resume_tokens) / len(jd_tokens)
            if jd_tokens else 0
        )

    final_score = round(
        (
            0.50 * embedding_score +
            0.35 * skill_score +
            0.15 * keyword_score
        ) * 100,
        2
    )

    return {
        "final_score": final_score,
        "breakdown": {
            "embedding": round(embedding_score * 100, 2),
            "skills": round(skill_score * 100, 2),
            "keywords": round(keyword_score * 100, 2),
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "top_matches": [
            {
                "chunk": m["chunk"],
                "score": round(m["score"] * 100, 2)
            }
            for m in top_matches
        ]
    }
