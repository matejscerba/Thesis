import json
import logging
import math
from enum import Enum
from typing import Optional, Dict, Any, List, Set

import pandas as pd
from pydantic import BaseModel, Field

from app.server.encoder import json_default

logger = logging.getLogger()


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


class MultiFilterItem(BaseModel):
    """This class represents a filter of attribute's values.

    :param str attribute_name: the name of the attribute
    :param FilterValue filter: the filter of the attribute's values
    """

    attribute_name: str
    filter: FilterValue

    def __hash__(self) -> int:
        """
        Computes a hash of this MultiFilterItem instance.

        :return: hash of this MultiFilterItem instance
        :rtype: int
        """
        return hash(json.dumps(self.model_dump(), sort_keys=True, default=json_default))


class Attribute(BaseModel):
    """This class represents an attribute of a product.

    :param str full_name: full name of the attribute (typically with unit in square brackets)
    :param str name: name of the attribute (typically without unit in square brackets)
    :param Optional[str] unit: unit of the attribute, default `None`
    :param Optional[str] group: group of the attribute, default `None`
    :param AttributeType type: type of the attribute
    :param Optional[AttributeOrder] order: order of the attribute, default `None`
    :param Optional[bool] continuous: specifies whether the values of this attribute are continuous, default `None`
    :param Optional[float] step: specifies what steps to use when generating filter values, default `None`
    :param Optional[int] round_decimals: specifies what precision to round values to when generating filter values,
    default `None`
    :param bool is_list: specifies whether this attribute has list values, default `False`
    """

    full_name: str
    name: str
    unit: Optional[str] = Field(default=None)
    group: Optional[str] = Field(default=None)
    type: AttributeType
    order: Optional[AttributeOrder] = Field(default=None)
    continuous: Optional[bool] = Field(default=None)
    step: Optional[float] = Field(default=None)
    round_decimals: Optional[int] = Field(default=None)
    is_list: bool = Field(default=False)

    def get_range_filter_value(
        self, value: float, products: pd.DataFrame, initial_value: Optional[float] = None
    ) -> FilterValue:
        """
        Gets a FilterValue instance for given value.

        :param float value: the value of this attribute
        :param pd.DataFrame products: the products in the current category
        :param Optional[float] initial_value: the initial value used for rounding
        :return: filter value of this attribute based on the given value
        :rtype: FilterValue
        """
        from app.attributes.handler import AttributeHandler

        if self.type != AttributeType.NUMERICAL and not self.continuous:
            raise ValueError(f"Attribute {self.full_name} is numerical or not continuous.")
        if pd.isna(value):
            return FilterValue(options={value})

        if self.round_decimals is not None and initial_value is not None:
            lower_bound, upper_bound = AttributeHandler.get_filter_value_bounds(
                attribute_name=self.full_name,
                value=value,
                initial_value=initial_value,
                products=products,
            )
            base = 10.0**-self.round_decimals
            lower_bound = int(math.floor(lower_bound / base)) * base
            upper_bound = int(math.ceil(upper_bound / base)) * base
            return FilterValue(lower_bound=lower_bound, upper_bound=upper_bound)

        if self.step is not None:
            lower_bound = value // self.step * self.step
            return FilterValue(lower_bound=lower_bound, upper_bound=lower_bound + self.step)

        logger.warning(f"Attribute {self.full_name} has no step or round attributes defined.")
        return FilterValue(options={value})

    def __hash__(self) -> int:
        """
        Computes a hash of this Attributes instance.

        :return: hash of this Attribute instance
        :rtype: int
        """
        return hash(json.dumps(self.model_dump(), sort_keys=True, default=json_default))


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

    def get_numerical_attributes(self) -> Dict[str, Attribute]:
        """Filters numerical attributes and returns them.

        :return: subset of attributes that are numerical
        :rtype: Dict[str, Attribute]
        """
        attributes = {
            key: attribute for key, attribute in self.attributes.items() if attribute.type == AttributeType.NUMERICAL
        }
        return attributes

    def drop_unused(self, category_name: str) -> None:
        """Drops unused attributes. If all products of a category do not have valid value of a attribute, then the
        attribute is unused.

        :param str category_name: the name of the category
        :return: None
        """
        from app.data_loader import DataLoader

        products = DataLoader.load_products(category_name=category_name)
        attributes_to_drop = products.columns[products.isna().all()]
        for attribute in attributes_to_drop:
            self.attributes.pop(attribute)
