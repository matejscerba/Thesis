import os
from typing import List, ClassVar, Optional, Set

import pandas as pd

from app.attributes.attribute import FilterValue
from app.data_loader import DataLoader
from app.explanations.selector import ExplanationsSelector
from app.products.category import Category, OrganizedCategory
from app.products.explanations import ProductExplanation
from app.products.product import Product
from app.products.unseen_statistics import UnseenStatistics, AbstractAttributeStatistics
from app.recommenders.selector import RecommenderSelector
from app.utils.attributes import expand_list_value


class ProductHandler:
    """This class handles operations with the products.

    :param ClassVar[int] _alternatives_size: number of alternatives to be displayed
    """

    _alternatives_size: ClassVar[int] = int(os.environ.get("ALTERNATIVES_SIZE", 10))

    @classmethod
    def get_categories(cls) -> List[str]:
        """Gets a list of categories supported by the application.

        :return: names of all categories
        :rtype: list
        """
        return DataLoader.load_categories()

    @classmethod
    def organize_category(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
        limit: Optional[int],
    ) -> Category:
        """Organizes the category based on candidates and discarded products.

        :param str category_name: the name of the category
        :param Set[int] candidate_ids: ids of the candidate products
        :param Set[int] discarded_ids: ids of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :param Optional[int] limit: number of products to display if the category is not organized (if no candidate
        product is given)
        :return: object representing the category and its products
        :rtype: Category
        """
        category = DataLoader.load_category(category_name=category_name)
        if len(candidate_ids) == 0:
            # There are no candidates, do not organize category, return single list of products with applied limit.
            for id in discarded_ids:
                category.pop(id)
            if limit is not None:
                category.apply_limit(limit=limit)
            return category

        # Recommend alternatives
        alternative_ids = RecommenderSelector.get_recommender().predict(
            category_name=category_name,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
            important_attributes=important_attributes,
        )

        # Pop candidates and discarded products from the category
        candidates = [category.pop(candidate_id) for candidate_id in candidate_ids]
        for discarded_id in discarded_ids:
            category.pop(discarded_id)

        # Pop alternatives from the category, no more than `cls._alternatives_size`
        if len(alternative_ids) >= cls._alternatives_size:
            alternative_ids = alternative_ids[: cls._alternatives_size]
        alternatives = [category.pop(alternative_id) for alternative_id in alternative_ids]

        # Compute statistics for the unseen products (the rest that remained in the category)
        attribute_statistics = []
        attributes = DataLoader.load_attributes(category_name=category_name)
        for attribute_id in important_attributes:
            attribute = attributes.attributes[attribute_id]
            attribute_statistics.append(
                AbstractAttributeStatistics.from_products(
                    category_name=category_name,
                    attribute=attribute,
                    products=DataLoader.load_products(
                        category_name=category_name,
                        usecols=important_attributes,
                    ),
                    candidate_ids=candidate_ids,
                    discarded_ids=discarded_ids,
                )
            )

        unseen = UnseenStatistics(attributes=attribute_statistics)

        return OrganizedCategory(
            candidates=candidates,
            alternatives=alternatives,
            unseen=unseen,
        )

    @classmethod
    def get_products(cls, category_name: str, ids: List[int]) -> List[Product]:
        """Gets list of product objects of the given category with the given ids.

        :param str category_name: the name of the category
        :param List[int] ids: ids of the products to load
        :return: product objects
        :rtype: List[Product]
        """
        category = DataLoader.load_category(category_name=category_name)
        return [category.pop(id) for id in ids]

    @classmethod
    def filter_products(
        cls,
        category_name: str,
        attribute_name: str,
        value: FilterValue,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
    ) -> pd.DataFrame:
        """Filters products and returns a dataframe containing products satisfying the filter (not including candidates
        and discarded products).

        :param str category_name: the name of the category
        :param str attribute_name: name of the attribute
        :param FilterValue value: the value of the filter to be used
        :param Set[int] candidate_ids: ids of the candidate products
        :param Set[int] discarded_ids: ids of the discarded products
        :raise Exception: Exception is raised if value does not contain any filter
        :return: dataframe containing products satisfying the filter
        :rtype: pd.DataFrame
        """
        products = DataLoader.load_products(category_name=category_name, usecols=[attribute_name])

        # Drop candidate and discarded rows
        products = products[products["id"].apply(lambda id: id not in candidate_ids and id not in discarded_ids)]
        options = value.options
        if options is not None:
            # Filter attribute by list of possible values of the attribute
            attribute = DataLoader.load_attribute(category_name=category_name, attribute_name=attribute_name)
            if attribute.is_list:
                # Attribute value is list, all products having at least one of the given options satisfies the filter
                products = products[
                    products[attribute_name].apply(
                        lambda x: not pd.isna(x)
                        and len(options) > 0
                        and len(set(expand_list_value(value=x)).intersection(options)) > 0
                    )
                ]
            else:
                # Apply filter checking whether product has its value in options
                products = products[products[attribute_name].apply(lambda x: x in options)]
        elif value.lower_bound is not None or value.upper_bound is not None:
            # Apply lower bound and/or upper bound filter
            if value.lower_bound is not None:
                products = products[products[attribute_name] >= value.lower_bound]
            if value.upper_bound is not None:
                products = products[products[attribute_name] <= value.upper_bound]
        else:
            raise Exception("options, lower bound and upper bound missing in filter.")

        return products

    @classmethod
    def filter_category(
        cls,
        category_name: str,
        attribute_name: str,
        value: FilterValue,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
    ) -> List[Product]:
        """Filters products and returns a list of products satisfying the filter (not including candidates and discarded
        products).

        :param str category_name: the name of the category
        :param str attribute_name: name of the attribute
        :param FilterValue value: the value of the filter to be used
        :param Set[int] candidate_ids: ids of the candidate products
        :param Set[int] discarded_ids: ids of the discarded products
        :return: dataframe containing products satisfying the filter
        :rtype: pd.DataFrame
        """
        products = cls.filter_products(
            category_name=category_name,
            attribute_name=attribute_name,
            value=value,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
        )
        category = DataLoader.load_category(category_name=category_name)
        return [category.pop(id) for id in products["id"]]

    @classmethod
    def explain(
        cls,
        category_name: str,
        product_id: int,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> ProductExplanation:
        """Explains the given product and its attributes.

        :param str category_name:
        :param int product_id:
        :param Set[int] candidate_ids: ids of the candidate products
        :param Set[int] discarded_ids: ids of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: explanation of a given product
        :rtype: ProductExplanation
        """
        return ExplanationsSelector.get_generator().explain(
            category_name=category_name,
            product_id=product_id,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
            important_attributes=important_attributes,
        )
