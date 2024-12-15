from abc import ABC, abstractmethod
from enum import Enum
from typing import Set, List, ClassVar


class RecommenderModel(str, Enum):
    """This enum represents the possible options for recommender models."""

    SET_BASED = "set_based"
    SET_BASED_CANDIDATES_ONLY = "set_based_candidates_only"


class AbstractRecommender(ABC):
    """This class holds the interface for recommender systems used by this application.

    :param ClassVar[RecommenderModel] model: the model of this recommender system
    """

    model: ClassVar[RecommenderModel]

    @classmethod
    @abstractmethod
    def predict(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> List[int]:
        """Predicts alternative products based on candidates and discarded products.

        :param str category_name: name of the category
        :param Set[int] candidate_ids: IDs of the candidate products
        :param Set[int] discarded_ids: IDs of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: IDs of the alternative products
        :rtype: List[int]
        """
        raise NotImplementedError()
