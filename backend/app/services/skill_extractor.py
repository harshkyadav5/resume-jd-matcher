import re
from app.core.skills import SKILL_VOCABULARY

def extract_skills(text: str) -> set[str]:
    text = text.lower()
    found = set()

    for skill in SKILL_VOCABULARY:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text):
            found.add(skill)

    return found
