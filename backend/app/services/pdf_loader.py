from pypdf import PdfReader

def extract_text_per_page(file_obj) -> list[str]:
    reader = PdfReader(file_obj)
    pages = []

    for page in reader.pages:
        text = page.extract_text() or ""
        pages.append(text)

    return pages
