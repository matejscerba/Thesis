from enum import Enum
import random
from typing import Optional, List

from pydantic import BaseModel

from app.data_loader import DataLoader


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

    @classmethod
    def user_study(cls) -> "AppFlow":
        assert len(DataLoader.load_categories()) >= 2
        assert len(UIType.__members__.values()) >= 2

        categories = random.sample(population=DataLoader.load_categories(), k=2)
        ui_types = random.sample(population=list(UIType.__members__.values()), k=2)
        return AppFlow(
            type=AppFlowType.USER_STUDY,
            setup=UserStudySetup(
                steps=[
                    UserStudySetupStep(category_name=category_name, ui_type=ui_type)
                    for category_name, ui_type in zip(categories, ui_types)
                ]
            ),
        )
