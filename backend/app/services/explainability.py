from typing import List


def build_explanation(
    embedding_score: float,
    skill_score: float,
    keyword_score: float,
    matched_skills: List[str],
    missing_skills: List[str]
) -> dict:
    reasons = []

    # Semantic similarity explanation
    if embedding_score >= 0.7:
        reasons.append(
            "Strong semantic similarity between the resume content and the job description."
        )
    elif embedding_score >= 0.4:
        reasons.append(
            "Moderate semantic similarity between the resume and job description."
        )
    else:
        reasons.append(
            "Low semantic similarity — resume content differs significantly from job requirements."
        )

    # Skill matching explanation
    if skill_score >= 0.6:
        reasons.append(
            "Good overlap of required technical skills mentioned in the job description."
        )
    elif skill_score >= 0.3:
        reasons.append(
            "Partial skill overlap — some required skills are present, others are missing."
        )
    else:
        reasons.append(
            "Limited overlap between resume skills and job requirements."
        )

    # Keyword overlap explanation
    if keyword_score >= 0.5:
        reasons.append(
            "Resume contains many job-specific keywords."
        )
    elif keyword_score >= 0.2:
        reasons.append(
            "Resume includes some relevant job keywords."
        )
    else:
        reasons.append(
            "Resume lacks important job-related keywords."
        )

    # Skill gap explanation
    if missing_skills:
        reasons.append(
            f"Missing or weak skills include: {', '.join(missing_skills[:5])}."
        )

    if matched_skills:
        reasons.append(
            f"Strong skills found: {', '.join(matched_skills[:5])}."
        )

    return {
        "breakdown": {
            "semantic_similarity": round(embedding_score * 100, 2),
            "skill_match": round(skill_score * 100, 2),
            "keyword_overlap": round(keyword_score * 100, 2)
        },
        "why_this_score": reasons
    }
