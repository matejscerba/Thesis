from typing import Any

import numpy as np
from flask.json.provider import _default
from pydantic import BaseModel


def json_default(data: Any) -> Any:
    """Converts `data` to JSON-serializable instance.

    :param Any data: data to be serialized
    :return: JSON-serializable data
    :rtype: Any
    """
    if isinstance(data, (int, float, bool, str)):
        return data
    if isinstance(data, np.int64):
        return int(data)
    if isinstance(data, set):
        return [json_default(item) for item in data]
    if isinstance(data, list):
        return [json_default(item) for item in data]
    if isinstance(data, dict):
        return {key: json_default(item) for key, item in data.items()}
    if isinstance(data, BaseModel):
        return data.model_dump()
    return _default(data)
