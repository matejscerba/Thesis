from typing import List, TypeVar, Type

T = TypeVar("T", bound=Type)


def get_all_subclasses(cls: T) -> List[T]:
    return list(set(cls.__subclasses__()).union([s for c in cls.__subclasses__() for s in get_all_subclasses(cls=c)]))
