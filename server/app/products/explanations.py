from enum import Enum
from typing import Any, List

from pydantic import BaseModel

from app.attributes.attribute import Attribute


class ProductAttributePosition(str, Enum):
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
    NONE = "none"
    BETTER_THAN_ALL_CANDIDATES = "better_than_all_candidates"


class ProductAttributeExplanation(BaseModel):
    attribute: Attribute
    attribute_value: Any
    position: ProductAttributePosition


class ProductExplanationMessage(BaseModel):
    code: ProductExplanationMessageCode


class ProductExplanation(BaseModel):
    message: ProductExplanationMessage
    attributes: List[ProductAttributeExplanation]
    price_position: ProductAttributePosition
