"""
Service for generating embeddings via Hugging Face Inference API.
Includes a query embedding cache for fast repeated lookups.
"""

import hashlib
from collections import OrderedDict
from threading import Lock
from typing import List, Optional

from huggingface_hub import InferenceClient
from app.core.config import get_settings

settings = get_settings()

# ── Singleton client ──
_client: Optional[InferenceClient] = None
_client_lock = Lock()


def get_hf_client() -> InferenceClient:
    global _client
    if _client is None:
        with _client_lock:
            if _client is None:
                if not settings.huggingface_api_token:
                    raise ValueError("HUGGINGFACE_API_TOKEN is missing in .env")
                _client = InferenceClient(token=settings.huggingface_api_token)
    return _client


# ── LRU embedding cache for queries (max 256 entries) ──
_CACHE_MAX = 256
_embedding_cache: OrderedDict[str, List[float]] = OrderedDict()
_cache_lock = Lock()


def _cache_key(text: str) -> str:
    return hashlib.md5(text.strip().lower().encode()).hexdigest()


def _get_cached(text: str) -> Optional[List[float]]:
    key = _cache_key(text)
    with _cache_lock:
        if key in _embedding_cache:
            _embedding_cache.move_to_end(key)
            return _embedding_cache[key]
    return None


def _set_cached(text: str, vector: List[float]):
    key = _cache_key(text)
    with _cache_lock:
        _embedding_cache[key] = vector
        if len(_embedding_cache) > _CACHE_MAX:
            _embedding_cache.popitem(last=False)


def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a list of texts using the configured HF model.
    Uses an in-memory LRU cache for single-text queries (chat runtime path).
    """
    if not texts:
        return []

    # Fast path: single text (query embedding) — check cache
    if len(texts) == 1:
        cached = _get_cached(texts[0])
        if cached is not None:
            return [cached]

    client = get_hf_client()
    try:
        response = client.feature_extraction(
            text=texts,
            model=settings.embedding_model_id,
        )
        result = response.tolist() if hasattr(response, "tolist") else response

        # Cache single-text results
        if len(texts) == 1 and result:
            _set_cached(texts[0], result[0])

        return result
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        raise
