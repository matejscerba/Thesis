from typing import Any

from flask.json.provider import _default
from pydantic import BaseModel


def json_default(data: Any) -> Any:
    if isinstance(data, list):
        return [json_default(item) for item in data]
    if isinstance(data, dict):
        return {key: json_default(item) for key, item in data.items()}
    if isinstance(data, BaseModel):
        return data.model_dump()
    return _default(data)
