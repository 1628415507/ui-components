"""百炼 OpenAI 兼容端点：统一读取密钥、base_url，并创建 ChatOpenAI / OpenAIEmbeddings。"""

import os
from typing import Any, Optional

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"

_env_loaded = False


def _ensure_env() -> None:
    global _env_loaded
    if not _env_loaded:
        load_dotenv()
        _env_loaded = True


def dashscope_api_key() -> str:
    _ensure_env()
    key = os.getenv("DASHSCOPE_API_KEY") or os.getenv("DASHSCOPE_KEY")
    if not key:
        raise ValueError("请在环境变量或 .env 中配置 DASHSCOPE_API_KEY 或 DASHSCOPE_KEY")
    return key


def dashscope_base_url() -> str:
    _ensure_env()
    return os.getenv("BASE_URL", DEFAULT_BASE_URL)


def create_chat_openai(
    model: Optional[str] = None,
    **kwargs: Any,
) -> ChatOpenAI:
    _ensure_env()
    return ChatOpenAI(
        model=model or os.getenv("MODEL_CHAT", "qwen3-max"),
        api_key=kwargs.pop("api_key", dashscope_api_key()),
        base_url=kwargs.pop("base_url", dashscope_base_url()),
        **kwargs,
    )


def create_openai_embeddings(
    model: Optional[str] = None,
    **kwargs: Any,
) -> OpenAIEmbeddings:
    _ensure_env()
    return OpenAIEmbeddings(
        model=model or os.getenv("MODEL_EMBEDDING", "text-embedding-v4"),
        api_key=kwargs.pop("api_key", dashscope_api_key()),
        base_url=kwargs.pop("base_url", dashscope_base_url()),
        **kwargs,
    )
