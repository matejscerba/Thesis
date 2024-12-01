from typing import Set, List, TYPE_CHECKING, Optional, Dict, Any

from flask import session

from app.app_flow import AppFlow, UIType

if TYPE_CHECKING:
    from app.attributes.attribute import MultiFilterItem
    from app.products.stopping_criteria import StoppingCriteria
    from app.products.unseen_statistics import UnseenStatistics


class Context:
    @property
    def app_flow(self) -> AppFlow:
        return session["app_flow"]

    @app_flow.setter
    def app_flow(self, value: AppFlow) -> None:
        session["app_flow"] = value

    @property
    def ui_type(self) -> UIType:
        return session["ui_type"]

    @ui_type.setter
    def ui_type(self, value: UIType) -> None:
        session["ui_type"] = value

    @property
    def session_id(self) -> str:
        return session.sid  # type: ignore[attr-defined]

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
    def alternatives(self) -> List[int]:
        return session["alternatives"]

    @alternatives.setter
    def alternatives(self, value: List[int]) -> None:
        session["alternatives"] = value

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

    @property
    def stopping_criteria(self) -> Optional["StoppingCriteria"]:
        return session["stopping_criteria"]

    @stopping_criteria.setter
    def stopping_criteria(self, value: Optional["StoppingCriteria"]) -> None:
        session["stopping_criteria"] = value

    @property
    def unseen_statistics(self) -> Optional["UnseenStatistics"]:
        return session["unseen_statistics"]

    @unseen_statistics.setter
    def unseen_statistics(self, value: Optional["UnseenStatistics"]) -> None:
        session["unseen_statistics"] = value

    @property
    def state(self) -> Dict[str, Any]:
        return {
            "candidates": list(self.candidates),
            "discarded": list(self.discarded),
            "alternatives": self.alternatives,
            "important_attributes": self.important_attributes,
            "stopping_criteria": self.stopping_criteria,
            "unseen_statistics": self.unseen_statistics,
        }


context: Context = Context()
