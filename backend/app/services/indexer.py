from app.services.vector_store import collection
from app.services.embeddings import embed_texts

def index_resume_chunks(chunks: list[dict], resume_id: str):
    print(f"Indexing {len(chunks)} chunks for resume {resume_id}")
    texts = [c["text"] for c in chunks]

    embeddings = embed_texts(texts)

    ids = [f"{resume_id}_{c['chunk_id']}" for c in chunks]
    metadatas = [
        {
            "resume_id": resume_id,
            "page": c["page"]
        }
        for c in chunks
    ]

    collection.add(
        documents=texts,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas
    )

    print("Chunks added to Chroma collection")