import re
from app.core.skills import SKILL_VOCABULARY

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower())


def extract_skills(text: str) -> set[str]:
    text = normalize(text)
    found = set()

    padded_text = f" {text} "

    for _, skills in SKILL_VOCABULARY.items():
        for canonical, aliases in skills.items():
            for alias in aliases:
                if f" {alias} " in padded_text:
                    found.add(canonical)
                    break

    return found
