from app.services.skill_extractor import extract_skills

def compare_skills(jd_text: str, resume_text: str):
    jd_skills = extract_skills(jd_text)
    resume_skills = extract_skills(resume_text)

    matched = jd_skills & resume_skills
    missing = jd_skills - resume_skills
    extra = resume_skills - jd_skills

    return {
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
        "extra_skills": sorted(extra)
    }
