from abc import abstractmethod, ABC
from enum import Enum
from typing import Set, List, ClassVar

from app.products.stopping_criteria import StoppingCriteria


class StoppingCriteriaModel(str, Enum):
    STOPPING_APRIORI = "stopping_apriori"


class AbstractStoppingCriteria(ABC):
    model: ClassVar[StoppingCriteriaModel]

    preference_threshold: ClassVar[float] = 0.0

    @classmethod
    @abstractmethod
    def generate(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> StoppingCriteria:
        raise NotImplementedError()
