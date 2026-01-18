import pdfplumber
from pathlib import Path

def extract_text_per_page(pdf_path: Path) -> list[str]:
    pages_text = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text(
                x_tolerance=2,
                y_tolerance=2,
                keep_blank_chars=False,
                use_text_flow=True
            )

            if text:
                text = " ".join(text.split())

            pages_text.append(text or "")

    return pages_text
