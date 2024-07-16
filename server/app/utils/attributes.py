import ast
from typing import List, Union


def expand_list_values(values: List[str]) -> List[str]:
    """Expand given values to a single list.

    `values` is expected to contain string representations of list, items such as "['a', 'b']".
    This method returns unique values of a concatenated list.
    If any exception occurs, return the initial values.

    :param List[str] values: input values to be expanded
    :return: all values appearing in each string representation of list if no Exception occurs,
    otherwise the initial value
    :rtype: List[str]
    """
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


def expand_list_value(value: str) -> Union[str, List[str]]:
    """Expand given value to a single list.

    `value` is expected to be a string representations of list, such as "['a', 'b']".
    This method returns unique values of the parsed list.
    If any exception occurs, return the initial value.

    :param List[str] value: input value to be expanded
    :return: value parsed as list if no Exception occurs, otherwise the initial value
    :rtype: Union[str, List[str]]
    """
    if not isinstance(value, str) or not value.startswith("["):
        return value
    try:
        list_value: List[str] = ast.literal_eval(value)
        list_value.sort()
        return list_value
    except Exception:
        return value
