from enum import Enum
from typing import Optional, Dict, Any, List

from pydantic import BaseModel, Field


class AttributeType(str, Enum):
    CATEGORICAL = "categorical"
    NUMERICAL = "numerical"


class AttributeOrder(str, Enum):
    ASCENDING = "asc"
    DESCENDING = "desc"


class Attribute(BaseModel):
    full_name: str
    name: str
    unit: Optional[str] = Field(default=None)
    group: Optional[str] = Field(default=None)
    type: AttributeType
    order: Optional[AttributeOrder] = Field(default=None)
    continuous: Optional[bool] = Field(default=None)


class CategoryAttributes(BaseModel):
    attributes: Dict[str, Attribute]

    @classmethod
    def from_data(cls, data: List[Dict[str, Any]]) -> "CategoryAttributes":
        return CategoryAttributes(
            attributes={attribute["full_name"]: Attribute.model_validate(attribute) for attribute in data}
        )
