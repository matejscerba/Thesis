import os
from abc import abstractmethod, ABC
from enum import Enum
from typing import Set, List, ClassVar

from app.products.stopping_criteria import StoppingCriteria


class StoppingCriteriaGeneratorModel(str, Enum):
    """This enum represents the possible options for stopping criteria models."""

    STOPPING_APRIORI = "stopping_apriori"


class AbstractStoppingCriteriaGenerator(ABC):
    """This class holds the interface for recommender systems used by this application.

    :param ClassVar[StoppingCriteriaGeneratorModel] model: the model of this stopping criteria generator
    :param ClassVar[float] PREFERENCE_THRESHOLD: the minimum value of the metric for a stopping criteria item to be
    considered good enough
    """

    model: ClassVar[StoppingCriteriaGeneratorModel]
    PREFERENCE_THRESHOLD: ClassVar[float] = float(os.environ.get("STOPPING_CRITERIA_PREFERENCE_THRESHOLD", "0.0"))

    @classmethod
    @abstractmethod
    def generate(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> StoppingCriteria:
        """Generates stopping criteria based on candidates and discarded products.

        :param str category_name: name of the category
        :param Set[int] candidate_ids: IDs of the candidate products
        :param Set[int] discarded_ids: IDs of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: Stopping criteria that are good enough
        :rtype: StoppingCriteria
        """
        raise NotImplementedError()
