from abc import abstractmethod, ABC
from enum import Enum
from typing import Set, List, ClassVar

from app.products.explanations import ProductExplanation


class ExplanationsModel(str, Enum):
    """This enum represents the possible options for explanations models."""

    CONTENT_BASED = "content_based"
    NEUTRAL = "neutral"


class AbstractExplanations(ABC):
    """This class holds the interface for explanations generator used by this application.

    :param ClassVar[ExplanationsModel] model: the model of this explanations generator
    """

    model: ClassVar[ExplanationsModel]

    @classmethod
    @abstractmethod
    def explain(
        cls,
        category_name: str,
        product_id: int,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> ProductExplanation:
        """Explains the given product and its attributes.

        :param str category_name:
        :param int product_id:
        :param Set[int] candidate_ids: ids of the candidate products
        :param Set[int] discarded_ids: ids of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: explanation of a given product
        :rtype: ProductExplanation
        """
        raise NotImplementedError()
