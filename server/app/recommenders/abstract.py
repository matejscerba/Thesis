import math
from abc import ABC, abstractmethod
from enum import Enum
import random
from typing import Set, List, ClassVar, Tuple


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
    def _post_process(
        cls,
        items: List[Tuple[int, float]],
        limit: int,
    ) -> List[int]:
        """Post processes items with their scores.

        :param List[Tuple[int, float]] items: items to be post processed (ID, score)
        :param int limit: maximum number of items to be returned
        :return: IDs of the alternative products
        :rtype: List[int]
        """
        result = []

        if len(items) > 0:
            # Return the item with the best score
            result.append(items[0][0])

            # Add other items "randomly"
            num_randomized_items = limit - 1
            for _ in range(num_randomized_items):
                # Generate set of score options (upper bounds of bins - 1 unit wide)
                bin_upper_bounds = set()
                for item in items:
                    if item[0] in result:
                        continue
                    bin_upper_bounds.add(math.ceil(item[1]))
                if len(bin_upper_bounds) > 0:
                    upper_bounds = list(bin_upper_bounds)
                    min_upper_bound = min(upper_bounds)
                    # Set weights so that the lowest upper bound has weight 1, higher-scored bins are preferred
                    upper_bounds_weights = [bound - min_upper_bound + 1 for bound in upper_bounds]
                    upper_bound = random.choices(population=upper_bounds, weights=upper_bounds_weights, k=1)[0]

                    # We selected bin with upper bound `upper_bound`, now select product from this bin uniformly
                    # randomly
                    bin_items = [
                        item[0]
                        for item in items
                        if item[0] not in result and item[1] > upper_bound - 1 and item[1] <= upper_bound
                    ]
                    result.append(random.choice(bin_items))

        return result

    @classmethod
    @abstractmethod
    def _predict_impl(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> List[Tuple[int, float]]:
        """Scores products and orders all except candidates and discarded by their score, which is returned as well.

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
