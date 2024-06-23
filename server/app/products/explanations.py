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


class ProductAttributeExplanation(BaseModel):
    attribute: Attribute
    attribute_value: Any
    position: ProductAttributePosition


class ProductExplanation(BaseModel):
    message: str
    attributes: List[ProductAttributeExplanation]
    price_position: ProductAttributePosition
