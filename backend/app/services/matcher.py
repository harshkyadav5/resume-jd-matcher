from app.services.embeddings import embed_texts
from app.services.similarity import cosine_similarity

def match_resume_with_jd(
    resume_chunks: list[dict],
    jd_chunks: list[dict],
    top_k: int = 5
):
    resume_texts = [c["text"] for c in resume_chunks]
    jd_texts = [c["text"] for c in jd_chunks]

    resume_embeddings = embed_texts(resume_texts)
    jd_embeddings = embed_texts(jd_texts)

    scores = []

    for r_idx, r_emb in enumerate(resume_embeddings):
        for j_emb in jd_embeddings:
            sim = cosine_similarity(r_emb, j_emb)
            scores.append({
                "chunk": resume_chunks[r_idx],
                "score": sim
            })

    scores.sort(key=lambda x: x["score"], reverse=True)

    top_matches = scores[:top_k]

    avg_score = sum(m["score"] for m in top_matches) / len(top_matches)

    return {
        "match_score": round(avg_score * 100, 2),
        "top_matches": top_matches
    }
