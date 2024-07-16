from enum import Enum
from typing import Optional, Dict, Any, List, Set

from pydantic import BaseModel, Field


class AttributeType(str, Enum):
    """This enum represents the possible types of an attribute."""

    CATEGORICAL = "categorical"
    NUMERICAL = "numerical"


class AttributeOrder(str, Enum):
    """This enum represents the possible orders of an attribute."""

    ASCENDING = "asc"
    DESCENDING = "desc"


class AttributeName(str, Enum):
    """This enum represents three most common attribute names."""

    NAME = "name"
    PRICE = "Price [CZK]"
    RATING = "Rating"


class FilterValue(BaseModel):
    """This class represents a filter of an attribute's values.

    :param Optional[float] lower_bound: lower bound of the numerical attribute
    :param Optional[float] upper_bound: upper bound of the numerical attribute
    :param Optional[Set[Any]] options: values of the attribute to be filtered
    """

    lower_bound: Optional[float] = Field(default=None)
    upper_bound: Optional[float] = Field(default=None)
    options: Optional[Set[Any]] = Field(default=None)


class Attribute(BaseModel):
    """This class represents an attribute of a product.

    :param str full_name: full name of the attribute (typically with unit in square brackets)
    :param str name: name of the attribute (typically without unit in square brackets)
    :param Optional[str] unit: unit of the attribute, default `None`
    :param Optional[str] group: group of the attribute, default `None`
    :param AttributeType type: type of the attribute
    :param Optional[AttributeOrder] order: order of the attribute, default `None`
    :param Optional[bool] continuous: specifies whether the values of this attribute are continuous, default `None`
    :param bool is_list: specifies whether this attribute has list values, default `False`
    """

    full_name: str
    name: str
    unit: Optional[str] = Field(default=None)
    group: Optional[str] = Field(default=None)
    type: AttributeType
    order: Optional[AttributeOrder] = Field(default=None)
    continuous: Optional[bool] = Field(default=None)
    is_list: bool = Field(default=False)


class CategoryAttributes(BaseModel):
    """This class represents attributes of a category.

    :param Dict[str, Any] attributes: attributes of a category, dictionary with keys being the full name of attributes
    """

    attributes: Dict[str, Attribute]

    @classmethod
    def from_data(cls, data: List[Dict[str, Any]]) -> "CategoryAttributes":
        """Loads attributes from raw data.

        The data is expected to contain list of attributes (dictionaries that can be parsed as Attribute instances)

        :param List[Dict[str, Any]] data: raw data containing the attributes
        :return: instance of CategoryAttributes class with parsed attributes
        :rtype: CategoryAttributes
        """
        return CategoryAttributes(
            attributes={attribute["full_name"]: Attribute.model_validate(attribute) for attribute in data}
        )

    def get_numerical_attributes(self, include_price: bool) -> Dict[str, Attribute]:
        """Filters numerical attributes and returns them.

        :param bool include_price: whether to include price attribute
        :return: subset of attributes that are numerical
        :rtype: Dict[str, Attribute]
        """
        attributes = {
            key: attribute for key, attribute in self.attributes.items() if attribute.type == AttributeType.NUMERICAL
        }
        if include_price is False:
            _ = attributes.pop(AttributeName.PRICE, None)
        return attributes

    def drop_unused(self, category_name: str) -> None:
        """Drops unused attributes. If all products of a category do not have valid value of a attribute, then the
        attribute is unused.

        :param str category_name: name of the category
        :return: None
        """
        from app.data_loader import DataLoader

        products = DataLoader.load_products(category_name=category_name)
        attributes_to_drop = products.columns[products.isna().all()]
        for attribute in attributes_to_drop:
            self.attributes.pop(attribute)
