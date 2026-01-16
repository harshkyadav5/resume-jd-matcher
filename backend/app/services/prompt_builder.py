def build_feedback_prompt(
    match_percentage: float,
    matched_skills: list[str],
    missing_skills: list[str]
) -> str:
    return f"""
You are an AI recruitment assistant.

Candidate Resume Match Score: {match_percentage}%

Matched Skills:
{', '.join(matched_skills) if matched_skills else 'None'}

Missing Skills:
{', '.join(missing_skills) if missing_skills else 'None'}

Write a concise, professional feedback (3–5 sentences) explaining:
- How well the candidate matches the role
- What they do well
- What they should improve

Do NOT invent skills.
Do NOT mention percentages explicitly in sentences.
"""
