from enum import Enum
from typing import Optional, Dict, Any, List

from pydantic import BaseModel, Field


class AttributeType(str, Enum):
    CATEGORICAL = "categorical"
    NUMERICAL = "numerical"


class AttributeOrder(str, Enum):
    ASCENDING = "asc"
    DESCENDING = "desc"


class AttributeName(str, Enum):
    NAME = "name"
    PRICE = "Price [CZK]"
    RATING = "Rating"


class Attribute(BaseModel):
    full_name: str
    name: str
    unit: Optional[str] = Field(default=None)
    group: Optional[str] = Field(default=None)
    type: AttributeType
    order: Optional[AttributeOrder] = Field(default=None)
    continuous: Optional[bool] = Field(default=None)
    is_list: bool = Field(default=False)


class CategoryAttributes(BaseModel):
    attributes: Dict[str, Attribute]

    @classmethod
    def from_data(cls, data: List[Dict[str, Any]]) -> "CategoryAttributes":
        return CategoryAttributes(
            attributes={attribute["full_name"]: Attribute.model_validate(attribute) for attribute in data}
        )

    def get_numerical_attributes(self, include_price: bool) -> Dict[str, Attribute]:
        attributes = {
            key: attribute for key, attribute in self.attributes.items() if attribute.type == AttributeType.NUMERICAL
        }
        if include_price is False:
            _ = attributes.pop(AttributeName.PRICE, None)
        return attributes

    def drop_unused(self, category_name: str) -> None:
        from app.data_loader import DataLoader

        products = DataLoader.load_products(category_name=category_name)
        attributes_to_drop = products.columns[products.isna().all()]
        for attribute in attributes_to_drop:
            self.attributes.pop(attribute)
