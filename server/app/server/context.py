import os
from typing import Set, List, TYPE_CHECKING, Optional, Dict, Any

from flask import session

from app.app_flow import AppFlow, UIType, AppFlowType

if TYPE_CHECKING:
    from app.attributes.attribute import MultiFilterItem
    from app.products.stopping_criteria import StoppingCriteria
    from app.products.unseen_statistics import UnseenStatistics


class Context:
    _user_study_step: Optional[int] = None

    @property
    def debug(self) -> bool:
        return os.environ.get("SERVER_DEBUG", "FALSE").upper() == "TRUE"

    @property
    def app_flow(self) -> AppFlow:
        flow_type = AppFlowType[os.environ.get("APP_FLOW_TYPE", "PRODUCTION").upper()]
        if flow_type == AppFlowType.PRODUCTION:
            return AppFlow.production()
        if flow_type == AppFlowType.USER_STUDY:
            if "app_flow" not in session:
                session["app_flow"] = AppFlow.user_study()
        return session["app_flow"]

    @app_flow.setter
    def app_flow(self, value: AppFlow) -> None:
        session["app_flow"] = value

    @property
    def user_study_step(self) -> Optional[int]:
        return self._user_study_step

    @user_study_step.setter
    def user_study_step(self, value: Optional[int]) -> None:
        self._user_study_step = value
        if value is not None:
            assert self.app_flow.setup is not None
            self.ui_type = self.app_flow.setup.steps[value - 1].ui_type
        else:
            self.ui_type = UIType[os.environ.get("PRODUCTION_UI_TYPE", "STOPPING_CRITERIA").upper()]

    @property
    def production_ui_type(self) -> UIType:
        return UIType[os.environ.get("PRODUCTION_UI_TYPE", "STOPPING_CRITERIA").upper()]

    @property
    def ui_type(self) -> Optional[UIType]:
        if AppFlowType[os.environ.get("APP_FLOW_TYPE", "PRODUCTION").upper()] == AppFlowType.PRODUCTION:
            return self.production_ui_type
        return session.get("ui_type")

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
    def alternatives(self) -> Optional[List[int]]:
        return session.get("alternatives")

    @alternatives.setter
    def alternatives(self, value: Optional[List[int]]) -> None:
        session["alternatives"] = value

    @property
    def discarded(self) -> Set[int]:
        return session["discarded"]

    @discarded.setter
    def discarded(self, value: Set[int]) -> None:
        session["discarded"] = value

    @property
    def filter(self) -> Optional[List["MultiFilterItem"]]:
        return session.get("filter")

    @filter.setter
    def filter(self, value: Optional[List["MultiFilterItem"]]) -> None:
        session["filter"] = value

    @property
    def limit(self) -> Optional[int]:
        return session.get("limit")

    @limit.setter
    def limit(self, value: Optional[int]) -> None:
        session["limit"] = value

    @property
    def stopping_criteria(self) -> Optional["StoppingCriteria"]:
        return session.get("stopping_criteria")

    @stopping_criteria.setter
    def stopping_criteria(self, value: Optional["StoppingCriteria"]) -> None:
        session["stopping_criteria"] = value

    @property
    def unseen_statistics(self) -> Optional["UnseenStatistics"]:
        return session.get("unseen_statistics")

    @unseen_statistics.setter
    def unseen_statistics(self, value: Optional["UnseenStatistics"]) -> None:
        session["unseen_statistics"] = value

    @property
    def state(self) -> Dict[str, Any]:
        try:
            return {
                "candidates": list(self.candidates),
                "discarded": list(self.discarded),
                "alternatives": self.alternatives,
                "important_attributes": self.important_attributes,
                "stopping_criteria": (
                    self.stopping_criteria.model_dump() if self.stopping_criteria is not None else None
                ),
                "unseen_statistics": (
                    self.unseen_statistics.model_dump() if self.unseen_statistics is not None else None
                ),
            }
        except KeyError:
            return {}


context: Context = Context()
