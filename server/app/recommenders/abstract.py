from abc import ABC, abstractmethod
from enum import Enum
from typing import Set, List, ClassVar, Tuple


class RecommenderModel(str, Enum):
    """This enum represents the possible options for recommender models."""

    SET_BASED = "set_based"
    SET_BASED_CANDIDATES_ONLY = "set_based_candidates_only"
    SET_BASED_WITH_DIVERSITY = "set_based_with_diversity"


class AbstractRecommender(ABC):
    """This class holds the interface for recommender systems used by this application.

    :param ClassVar[RecommenderModel] model: the model of this recommender system
    """

    model: ClassVar[RecommenderModel]

    @classmethod
    @abstractmethod
    def _post_process(
        cls,
        items: List[Tuple[int, float]],
        limit: int,
    ) -> List[int]:
        """Post processes items with their scores.

        :param List[Tuple[int, float]] items: items to be post processed (ID, score)
        :param int limit: maximum number of items to be returned
        :return: IDs of the alternative products and their scores
        :rtype: List[Tuple[int, float]]
        """
        raise NotImplementedError()

    @classmethod
    @abstractmethod
    def _predict_impl(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> List[Tuple[int, float]]:
        """Predicts alternative products based on candidates and discarded products.

        :param str category_name: name of the category
        :param Set[int] candidate_ids: IDs of the candidate products
        :param Set[int] discarded_ids: IDs of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: IDs of the alternative products and their scores
        :rtype: List[Tuple[int, float]]
        """
        raise NotImplementedError()

    @classmethod
    def predict(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
        limit: int,
    ) -> List[int]:
        """Predicts alternative products based on candidates and discarded products.

        :param str category_name: name of the category
        :param Set[int] candidate_ids: IDs of the candidate products
        :param Set[int] discarded_ids: IDs of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :param int limit: maximum number of items to return
        :return: IDs of the alternative products
        :rtype: List[int]
        """
        items = cls._predict_impl(
            category_name=category_name,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
            important_attributes=important_attributes,
        )
        return cls._post_process(items=items, limit=limit)
