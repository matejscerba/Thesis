from typing import List, Optional, ClassVar

from app.data_loader import DataLoader
from app.products.category import Category, OrganizedCategory


class SimpleProductHandler:
    _alternatives_size: ClassVar[int] = 10

    @classmethod
    def organize_category(
        cls, name: str, candidate_ids: Optional[List[str]] = None, discarded_ids: Optional[List[str]] = None
    ) -> Category:
        category = DataLoader.load_products(category=name)
        if candidate_ids is None or discarded_ids is None:
            return category

        candidates = [category.pop(candidate_id) for candidate_id in candidate_ids]
        discarded = [category.pop(discarded_id) for discarded_id in discarded_ids]
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
            discarded=discarded,
        )
