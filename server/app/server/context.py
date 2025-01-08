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
                session["app_flow"] = AppFlow.user_study().model_dump()
        return AppFlow.model_validate(session["app_flow"])

    @app_flow.setter
    def app_flow(self, value: AppFlow) -> None:
        session["app_flow"] = value.model_dump()

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
        ui_type = session.get("ui_type")
        return UIType[ui_type] if ui_type is not None else None

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
        from app.attributes.attribute import MultiFilterItem

        filter = session.get("filter")
        return [MultiFilterItem.model_validate(item) for item in filter] if filter is not None else None

    @filter.setter
    def filter(self, value: Optional[List["MultiFilterItem"]]) -> None:
        session["filter"] = [item.model_dump() for item in value] if value is not None else None

    @property
    def limit(self) -> Optional[int]:
        return session.get("limit")

    @limit.setter
    def limit(self, value: Optional[int]) -> None:
        session["limit"] = value

    @property
    def stopping_criteria(self) -> Optional["StoppingCriteria"]:
        from app.products.stopping_criteria import StoppingCriteria

        criteria = session.get("stopping_criteria")
        return StoppingCriteria.model_validate(criteria) if criteria is not None else None

    @stopping_criteria.setter
    def stopping_criteria(self, value: Optional["StoppingCriteria"]) -> None:
        session["stopping_criteria"] = value.model_dump() if value is not None else None

    @property
    def unseen_statistics(self) -> Optional["UnseenStatistics"]:
        from app.products.unseen_statistics import UnseenStatistics

        statistics = session.get("unseen_statistics")
        return UnseenStatistics.model_validate(statistics) if statistics is not None else None

    @unseen_statistics.setter
    def unseen_statistics(self, value: Optional["UnseenStatistics"]) -> None:
        session["unseen_statistics"] = value.model_dump() if value is not None else None

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

    @property
    def study_id(self) -> Optional[str]:
        return os.environ.get("PROLIFIC_STUDY_ID")


context: Context = Context()
