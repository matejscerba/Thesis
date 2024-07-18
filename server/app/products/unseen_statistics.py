from typing import List, Union, Set, Any

import pandas as pd
from pydantic import BaseModel

from app.attributes.attribute import Attribute, AttributeType, FilterValue
from app.utils.attributes import expand_list_values


class AbstractAttributeStatistics(BaseModel):
    """This class represents a base class for attribute statistics.

    :param Attribute attribute: the attribute for which the statistics are provided
    :param int num_products: number of products with the relevant values of this attribute
    """

    attribute: Attribute
    num_products: int

    @classmethod
    def _count_products(
        cls,
        category_name: str,
        attribute: Attribute,
        value: FilterValue,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
    ) -> int:
        """Counts the number of products satisfying the given filter.

        :param str category_name: the name of the category
        :param Attribute attribute: the attribute to be filtered
        :param FilterValue value: the value of the filter to be used
        :param Set[int] candidate_ids: ids of the candidate products
        :param Set[int] discarded_ids: ids of the discarded products
        :return: number of products satisfying given filter
        :rtype: int
        """
        from app.products.handler import ProductHandler

        return len(
            ProductHandler.filter_products(
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
        """Generates statistics from products dataframe.

        :param str category_name: the name of the category
        :param Attribute attribute: the attribute to be described
        :param pd.DataFrame products: products to be considered
        :param Set[int] candidate_ids: ids of the candidate products
        :param Set[int] discarded_ids: ids of the discarded products
        :return: statistics describing the given attribute based on the given products
        :rtype: AttributeStatistics
        :raise ValueError: if attribute has unknown attribute type
        """
        options = products[attribute.full_name].dropna().unique().tolist()
        candidates = products[products["id"].apply(lambda x: x in candidate_ids)]
        if attribute.type == AttributeType.NUMERICAL:
            # Attribute is numerical, generate NumericalAttributeStatistics - based on lower and upper bound
            options.sort()
            lower_bound = candidates[attribute.full_name].min()
            upper_bound = candidates[attribute.full_name].max()
            return NumericalAttributeStatistics(
                attribute=attribute,
                num_products=cls._count_products(
                    category_name=category_name,
                    attribute=attribute,
                    value=FilterValue(lower_bound=lower_bound, upper_bound=upper_bound),
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
            selected_options = candidates[attribute.full_name].dropna().unique().tolist()
            if attribute.is_list:
                # Expand values to single list
                options = expand_list_values(values=options)
                selected_options = expand_list_values(values=selected_options)
            available_options = [option for option in options if option not in selected_options]
            selected_options.sort()
            available_options.sort()
            return CategoricalAttributeStatistics(
                attribute=attribute,
                num_products=cls._count_products(
                    category_name=category_name,
                    attribute=attribute,
                    value=FilterValue(options=selected_options),
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
