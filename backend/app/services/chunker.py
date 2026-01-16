from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_pages(pages: list[str]) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=80,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    chunks = []

    for page_num, page_text in enumerate(pages):
        if not page_text.strip():
            continue

        page_chunks = splitter.split_text(page_text)

        for idx, chunk in enumerate(page_chunks):
            chunks.append({
                "page": page_num + 1,
                "chunk_id": f"{page_num}_{idx}",
                "text": chunk
            })

    return chunks


def chunk_text(text: str) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=80,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    chunks = splitter.split_text(text)

    return [
        {
            "chunk_id": f"jd_{i}",
            "text": chunk
        }
        for i, chunk in enumerate(chunks)
    ]