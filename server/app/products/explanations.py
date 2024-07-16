from enum import Enum
from typing import Any, List

from pydantic import BaseModel

from app.attributes.attribute import Attribute


class ProductAttributePosition(str, Enum):
    """This enum represents the possible positions of an attribute's value."""

    BETTER = "better"
    BEST = "best"
    NEUTRAL = "neutral"
    RELEVANT = "relevant"
    WORST = "worst"
    WORSE = "worse"
    HIGHER_RATED = "higher_rated"
    HIGHEST_RATED = "highest_rated"
    LOWEST_RATED = "lowest_rated"
    LOWER_RATED = "lower_rated"


class ProductExplanationMessageCode(str, Enum):
    """This enum represents the possible message codes for a product explanation message."""

    NONE = "none"
    BETTER_THAN_ALL_CANDIDATES = "better_than_all_candidates"


class ProductAttributeExplanation(BaseModel):
    """This class represents an explanation of an attribute of a product.

    :param Attribute attribute: attribute which this explanation is about
    :param Any attribute_value: value of the attribute
    :param ProductAttributePosition position: position of the attribute and its value
    """

    attribute: Attribute
    attribute_value: Any
    position: ProductAttributePosition


class ProductExplanationMessage(BaseModel):
    """This class represents an explanation of a product as a whole.

    :param ProductExplanationMessageCode code: code of the message
    """

    code: ProductExplanationMessageCode


class ProductExplanation(BaseModel):
    """This class represents an explanation of an attribute of a product.

    :param ProductExplanationMessage message: attribute which this explanation is about
    :param List[ProductAttributeExplanation] attributes: explanations of the attributes of a product
    :param ProductAttributePosition price_position: position of the price attribute
    """

    message: ProductExplanationMessage
    attributes: List[ProductAttributeExplanation]
    price_position: ProductAttributePosition
