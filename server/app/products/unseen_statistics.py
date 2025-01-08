from typing import List, Union, Set, Any, cast

import pandas as pd
from pydantic import BaseModel

from app.attributes.attribute import Attribute, AttributeType, FilterValue, MultiFilterItem


class AbstractAttributeStatistics(BaseModel):
    """This class represents a base class for attribute statistics.

    :param Attribute attribute: the attribute for which the statistics are provided
    :param int num_products: number of products with the relevant values of this attribute
    """

    attribute: Attribute
    num_products: int

    @classmethod
    def from_products(
        cls,
        category_name: str,
        attribute: Attribute,
        products: pd.DataFrame,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
    ) -> "AttributeStatistics":
        """Generates statistics from products dataframe.

        :param str category_name: the name of the category
        :param Attribute attribute: the attribute to be described
        :param pd.DataFrame products: products to be considered
        :param Set[int] candidate_ids: IDs of the candidate products
        :param Set[int] discarded_ids: IDs of the discarded products
        :return: statistics describing the given attribute based on the given products
        :rtype: AttributeStatistics
        :raise ValueError: if attribute has unknown attribute type
        """
        from app.products.handler import ProductHandler

        options = cast(List[float], products[attribute.full_name].dropna().unique().tolist())
        candidates = products[products["id"].apply(lambda x: x in candidate_ids)]
        if attribute.type == AttributeType.NUMERICAL:
            # Attribute is numerical, generate NumericalAttributeStatistics - based on lower and upper bound
            options.sort()
            lower_bound = candidates[attribute.full_name].min()
            upper_bound = candidates[attribute.full_name].max()
            return NumericalAttributeStatistics(
                attribute=attribute,
                num_products=ProductHandler.count_products(
                    category_name=category_name,
                    filter=[
                        MultiFilterItem(
                            attribute_name=attribute.full_name,
                            filter=FilterValue(lower_bound=lower_bound, upper_bound=upper_bound),
                        )
                    ],
                    candidate_ids=candidate_ids,
                    discarded_ids=discarded_ids,
                ),
                lower_bound_index=options.index(lower_bound) if not pd.isna(lower_bound) else -1,
                upper_bound_index=options.index(upper_bound) if not pd.isna(upper_bound) else -1,
                options=options,
            )
        elif attribute.type == AttributeType.CATEGORICAL:
            # Attribute is categorical, generate CategoricalAttributeStatistics - based on selected and available
            # options
            selected_options = cast(List[str], candidates[attribute.full_name].dropna().unique().tolist())
            available_options = [option for option in options if option not in selected_options]
            selected_options.sort()
            available_options.sort()
            return CategoricalAttributeStatistics(
                attribute=attribute,
                num_products=ProductHandler.count_products(
                    category_name=category_name,
                    filter=[
                        MultiFilterItem(
                            attribute_name=attribute.full_name, filter=FilterValue(options=set(selected_options))
                        )
                    ],
                    candidate_ids=candidate_ids,
                    discarded_ids=discarded_ids,
                ),
                selected_options=selected_options,
                available_options=available_options,
            )
        raise ValueError(f"Unknown attribute type {attribute.type}")


class NumericalAttributeStatistics(AbstractAttributeStatistics):
    """This class represents statistics of a numerical attribute.

    :param int lower_bound_index: index of the lower bound value in options
    :param int upper_bound_index: index of the upper bound value in options
    :param List[float] options: all options of the given attribute
    """

    lower_bound_index: int
    upper_bound_index: int
    options: List[float]


class CategoricalAttributeStatistics(AbstractAttributeStatistics):
    """This class represents statistics of a numerical attribute.

    :param List[Any] selected_options: values of the given attribute that are relevant/selected
    :param List[Any] available_options: the rest of the values of the given attribute
    """

    selected_options: List[Any]
    available_options: List[Any]


AttributeStatistics = Union[NumericalAttributeStatistics, CategoricalAttributeStatistics]


class UnseenStatistics(BaseModel):
    """This class represents the statistics of the whole unseen set of products.

    :param List[AttributeStatistics] attributes: statistics of attributes
    """

    attributes: List[AttributeStatistics]
