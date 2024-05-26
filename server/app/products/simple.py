from typing import List, Optional, ClassVar

from app.data_loader import DataLoader
from app.products.category import Category, OrganizedCategory
from app.products.product import Product


class SimpleProductHandler:
    _alternatives_size: ClassVar[int] = 10

    @classmethod
    def organize_category(cls, name: str, candidate_ids: List[int], discarded_ids: List[int]) -> Category:
        category = DataLoader.load_products(category=name)
        if len(candidate_ids) == 0 and len(discarded_ids) == 0:
            return category

        candidates = [category.pop(candidate_id) for candidate_id in candidate_ids]
        for discarded_id in discarded_ids:
            category.pop(discarded_id)
        rest = category.products
        if len(rest) < cls._alternatives_size:
            alternatives = rest
            unseen = []
        else:
            alternatives = rest[: cls._alternatives_size]
            unseen = rest[cls._alternatives_size :]

        return OrganizedCategory(
            candidates=candidates,
            alternatives=alternatives,
            unseen=unseen,
        )

    @classmethod
    def get_products(cls, name: str, ids: List[int]) -> List[Product]:
        category = DataLoader.load_products(category=name)
        return [category.pop(id) for id in ids]
