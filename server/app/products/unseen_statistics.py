from typing import List, Union, Set, TYPE_CHECKING, Any

import pandas as pd
from pydantic import BaseModel

from app.attributes.attribute import Attribute, AttributeType

if TYPE_CHECKING:
    from app.products.simple import SimpleProductHandler, FilterValue


class AbstractAttributeStatistics(BaseModel):
    attribute: Attribute
    num_products: int

    @classmethod
    def count_products(
        cls,
        category_name: str,
        attribute: Attribute,
        value: "FilterValue",
        candidate_ids: Set[int],
        discarded_ids: Set[int],
    ) -> int:
        from app.products.simple import SimpleProductHandler

        return len(
            SimpleProductHandler.filter_dataframe(
                category_name=category_name,
                attribute_name=attribute.full_name,
                value=value,
                candidate_ids=candidate_ids,
                discarded_ids=discarded_ids,
            )
        )

    @classmethod
    def from_products(
        cls,
        category_name: str,
        attribute: Attribute,
        products: pd.DataFrame,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
    ) -> "AttributeStatistics":
        from app.products.simple import FilterValue

        options = products[attribute.full_name].dropna().unique().tolist()
        options.sort()
        candidates = products[products["id"].apply(lambda x: x in candidate_ids)]
        if attribute.type == AttributeType.NUMERICAL:
            lower_bound = candidates[attribute.full_name].min()
            upper_bound = candidates[attribute.full_name].max()
            return NumericalAttributeStatistics(
                attribute=attribute,
                num_products=cls.count_products(
                    category_name=category_name,
                    attribute=attribute,
                    value=FilterValue(lower_bound=lower_bound, upper_bound=upper_bound),
                    candidate_ids=candidate_ids,
                    discarded_ids=discarded_ids,
                ),
                lower_bound_index=options.index(lower_bound),
                upper_bound_index=options.index(upper_bound),
                options=options,
            )
        elif attribute.type == AttributeType.CATEGORICAL:
            selected_options = candidates[attribute.full_name].dropna().unique().tolist()
            selected_options.sort()
            available_options = [option for option in options if option not in selected_options]
            return CategoricalAttributeStatistics(
                attribute=attribute,
                num_products=cls.count_products(
                    category_name=category_name,
                    attribute=attribute,
                    value=FilterValue(options=selected_options),
                    candidate_ids=candidate_ids,
                    discarded_ids=discarded_ids,
                ),
                selected_options=selected_options,
                available_options=available_options,
            )
        raise ValueError(f"Unkown attribute type {attribute.type}")


class NumericalAttributeStatistics(AbstractAttributeStatistics):
    lower_bound_index: int
    upper_bound_index: int
    options: List[float]


class CategoricalAttributeStatistics(AbstractAttributeStatistics):
    selected_options: List[Any]
    available_options: List[Any]


AttributeStatistics = Union[NumericalAttributeStatistics, CategoricalAttributeStatistics]


class UnseenStatistics(BaseModel):
    attributes: List[AttributeStatistics]
