import ast
from typing import List, Union, Any


def expand_list_values(values: List[str]) -> List[str]:
    try:
        list_values: List[List[str]] = [ast.literal_eval(value) for value in values]
        expanded = []
        for inner_options in list_values:
            for value in inner_options:
                if value not in expanded:
                    expanded.append(value)
        expanded.sort()
        return expanded
    except Exception:
        return values


def expand_list_value(value: Any) -> Union[str, List[str]]:
    if not isinstance(value, str) or not value.startswith("["):
        return value
    try:
        list_value: List[str] = ast.literal_eval(value)
        list_value.sort()
        return list_value
    except Exception:
        return value
