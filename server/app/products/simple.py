from typing import List, ClassVar, Any, Optional, Set

import pandas as pd
from pydantic import BaseModel, Field

from app.data_loader import DataLoader
from app.products.category import Category, OrganizedCategory
from app.products.product import Product
from app.products.unseen_statistics import UnseenStatistics, AbstractAttributeStatistics
from app.recommenders.set_based import SetBasedRecommender


class FilterValue(BaseModel):
    lower_bound: Optional[float] = Field(default=None)
    upper_bound: Optional[float] = Field(default=None)
    options: Optional[List[Any]] = Field(default=None)


class SimpleProductHandler:
    _alternatives_size: ClassVar[int] = 10

    @classmethod
    def organize_category(
        cls, category_name: str, candidate_ids: Set[int], discarded_ids: Set[int], important_attributes: List[str]
    ) -> Category:
        alternative_ids = SetBasedRecommender.predict(
            category_name=category_name,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
            important_attributes=important_attributes,
        )

        category = DataLoader.load_category(category_name=category_name)
        # if len(candidate_ids) == 0 and len(discarded_ids) == 0:
        #     return category

        candidates = [category.pop(candidate_id) for candidate_id in candidate_ids]
        for discarded_id in discarded_ids:
            category.pop(discarded_id)

        if len(alternative_ids) >= cls._alternatives_size:
            alternative_ids = alternative_ids[: cls._alternatives_size]
        alternatives = [category.pop(alternative_id) for alternative_id in alternative_ids]

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
        category = DataLoader.load_category(category_name=category_name)
        return [category.pop(id) for id in ids]

    @classmethod
    def filter_dataframe(
        cls,
        category_name: str,
        attribute_name: str,
        value: FilterValue,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
    ) -> pd.DataFrame:
        products = DataLoader.load_products(category_name=category_name, usecols=[attribute_name])
        products = products[products["id"].apply(lambda id: id not in candidate_ids and id not in discarded_ids)]
        options = value.options
        if options is not None:
            products = products[products[attribute_name].apply(lambda x: x in options)]
        elif value.lower_bound is not None or value.upper_bound is not None:
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
        products = cls.filter_dataframe(
            category_name=category_name,
            attribute_name=attribute_name,
            value=value,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
        )
        category = DataLoader.load_category(category_name=category_name)
        return [category.pop(id) for id in products["id"]]
