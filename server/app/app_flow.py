from enum import Enum
from typing import Optional, List

from pydantic import BaseModel


class AppFlowType(str, Enum):
    PRODUCTION = "PRODUCTION"
    USER_STUDY = "USER_STUDY"


class UIType(str, Enum):
    UNSEEN_STATISTICS = "UNSEEN_STATISTICS"
    STOPPING_CRITERIA = "STOPPING_CRITERIA"


class UserStudySetupStep(BaseModel):
    category_name: str
    ui_type: UIType


class UserStudySetup(BaseModel):
    steps: List[UserStudySetupStep]


class AppFlow(BaseModel):
    type: AppFlowType
    setup: Optional[UserStudySetup] = None

    @classmethod
    def production(cls) -> "AppFlow":
        return AppFlow(type=AppFlowType.PRODUCTION)
