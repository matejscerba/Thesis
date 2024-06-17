from typing import List, ClassVar

from app.data_loader import DataLoader
from app.products.category import Category, OrganizedCategory
from app.products.product import Product
from app.recommenders.set_based import SetBasedRecommender


class SimpleProductHandler:
    _alternatives_size: ClassVar[int] = 10

    @classmethod
    def organize_category(
        cls, category_name: str, candidate_ids: List[int], discarded_ids: List[int], important_attributes: List[int]
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

        return OrganizedCategory(
            candidates=candidates,
            alternatives=alternatives,
            # unseen=unseen,
        )

    @classmethod
    def get_products(cls, category_name: str, ids: List[int]) -> List[Product]:
        category = DataLoader.load_category(category_name=category_name)
        return [category.pop(id) for id in ids]
