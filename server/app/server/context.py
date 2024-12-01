from typing import Set, List, TYPE_CHECKING, Optional

from flask import session

if TYPE_CHECKING:
    from app.attributes.attribute import MultiFilterItem


class Context:
    @property
    def category_name(self) -> str:
        return session["category_name"]

    @category_name.setter
    def category_name(self, value: str) -> None:
        session["category_name"] = value

    @property
    def important_attributes(self) -> List[str]:
        return session["important_attributes"]

    @important_attributes.setter
    def important_attributes(self, value: List[str]) -> None:
        session["important_attributes"] = value

    @property
    def candidates(self) -> Set[int]:
        return session["candidates"]

    @candidates.setter
    def candidates(self, value: Set[int]) -> None:
        session["candidates"] = value

    @property
    def discarded(self) -> Set[int]:
        return session["discarded"]

    @discarded.setter
    def discarded(self, value: Set[int]) -> None:
        session["discarded"] = value

    @property
    def product_id(self) -> int:
        return session["product_id"]

    @product_id.setter
    def product_id(self, value: int) -> None:
        session["product_id"] = value

    @property
    def filter(self) -> List["MultiFilterItem"]:
        return session["filter"]

    @filter.setter
    def filter(self, value: List["MultiFilterItem"]) -> None:
        session["filter"] = value

    @property
    def limit(self) -> Optional[int]:
        return session["limit"]

    @limit.setter
    def limit(self, value: Optional[int]) -> None:
        session["limit"] = value


context = Context()
