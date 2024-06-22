from enum import Enum
from typing import Any, List

from pydantic import BaseModel

from app.attributes.attribute import Attribute


class ProductAttributePosition(str, Enum):
    BEST = "best"
    BEST_RATED = "best_rated"
    NEUTRAL = "neutral"
    WORST_RATED = "worst_rated"
    WORST = "worst"


class ProductAttributeExplanation(BaseModel):
    attribute: Attribute
    attribute_value: Any
    position: ProductAttributePosition


class ProductExplanation(BaseModel):
    message: str
    attributes: List[ProductAttributeExplanation]
    price_position: ProductAttributePosition
