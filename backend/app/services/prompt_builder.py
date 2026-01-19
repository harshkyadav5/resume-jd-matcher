def build_feedback_prompt(
    job_title: str,
    match_percentage: float,
    matched_skills: list[str],
    missing_skills: list[str],
    top_snippets: list[str] | None = None
) -> str:

    snippets_section = ""
    if top_snippets:
        snippets_section = f"""
Relevant Resume Snippets:
- {chr(10).join(top_snippets)}
"""

    return f"""
You are a technical recruiter reviewing a candidate resume.

Job Title:
{job_title}

Resume Match Score:
{match_percentage}%

Matched Skills:
{', '.join(matched_skills) if matched_skills else 'None'}

Missing or Weak Skills:
{', '.join(missing_skills) if missing_skills else 'None'}

{snippets_section}

Write professional hiring feedback that includes:

1. Overall candidate fit for the role
2. Key strengths
3. Skill gaps or weaknesses
4. Resume improvement suggestions
5. Final hiring recommendation

Rules:
- Do NOT invent skills
- Do NOT assume experience not mentioned
- Do NOT mention percentages explicitly in sentences
- Keep the response concise and recruiter-style
"""
