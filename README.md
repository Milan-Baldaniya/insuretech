<div align="center">

# 🛡️ InsureTech — Insurance & Finance RAG Assistant

<img src="https://img.shields.io/badge/FastAPI-06101C?style=for-the-badge&logo=fastapi&logoColor=FFCF5C" />
<img src="https://img.shields.io/badge/pgvector-06101C?style=for-the-badge&logo=postgresql&logoColor=FFCF5C" />
<img src="https://img.shields.io/badge/Supabase-06101C?style=for-the-badge&logo=supabase&logoColor=FFCF5C" />
<img src="https://img.shields.io/badge/Next.js_16-06101C?style=for-the-badge&logo=nextdotjs&logoColor=FFCF5C" />

**[Live demo ↗](https://insuretech-wine.vercel.app)**

</div>

A production advisory assistant for insurance and personal finance, built end to end —
retrieval, compliance, memory and streaming — rather than assembled from a framework.

> **Deliberately not LangChain-based.** The retrieval and orchestration layers are written
> directly so that ranking, gating and citation behaviour stay inspectable.

## What it does

- **Hybrid retrieval** — vector similarity combined with keyword search, then heuristic
  reranking and confidence gating, over a curated knowledge base. Answers carry citations.
- **Compliance layer** — an IRDAI rule engine plus a structured legal-knowledge service, so
  responses stay inside regulatory bounds.
- **Multi-turn memory & personalisation** — session memory and a user profile service feed
  the prompt, so advice adapts across a conversation.
- **SSE token streaming** — answers stream to the client as they generate.
- **Admin ingestion panel** — upload source documents, run embeddings, inspect the catalogue.

## Architecture

```
backend/                      FastAPI
  app/api/                    chat · documents · admin_data
  app/core/                   auth · config · db
  app/services/
    retrieval.py              hybrid search + reranking + confidence gate
    embeddings.py             embedding generation
    ingestion.py              document → chunks → vectors
    llm.py                    model client (OpenAI-compatible)
    memory.py                 multi-turn session memory
    legal_knowledge.py        IRDAI / regulatory rules
    structured_knowledge.py   product catalogue reasoning
    profile.py                user personalisation
  scripts/                    run_ingestion.py · run_embeddings.py
  docs/                       evaluation_dataset.csv · pdf_inventory.csv

frontend/                     Next.js 16 · React 19 · Tailwind 4 · Supabase SSR
```

Vectors live in Supabase Postgres with `pgvector`. The backend deploys to Render, the
frontend to Vercel.

## Running locally

```bash
# backend
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                 # fill in Supabase + model keys
uvicorn app.main:app --reload

# one-time: load the knowledge base
python scripts/run_ingestion.py
python scripts/run_embeddings.py

# frontend
cd ../frontend
npm install
npm run dev
```

## Evaluation

`backend/docs/evaluation_dataset.csv` holds the question set used to score retrieval
quality and answer grounding as the pipeline changed.

---

<div align="center">
<sub>Built by <a href="https://github.com/Milan-Baldaniya">Milan Baldaniya</a> · Full-Stack AI / LLM Application Engineer</sub>
</div>
