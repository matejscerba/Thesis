from typing import List, Dict, Any

import pandas as pd
from pydantic import BaseModel, model_serializer
from pydantic_core.core_schema import SerializerFunctionWrapHandler

from app.products.product import Product
from app.products.unseen_statistics import UnseenStatistics


class Category(BaseModel):
    organized: bool


class UnorganizedCategory(Category):
    organized: bool = False
    data: Dict[str, Product]
    remaining: int = 0

    @classmethod
    def from_raw_list(cls, data: List[Dict[str, Any]]) -> "UnorganizedCategory":
        return UnorganizedCategory(data={str(product["id"]): Product.model_validate(product) for product in data})

    @classmethod
    def from_dataframe(cls, df: pd.DataFrame) -> "UnorganizedCategory":
        return UnorganizedCategory(
            data={str(row["id"]): Product.from_dataframe_row(id=int(row["id"]), row=row) for _, row in df.iterrows()}
        )

    @property
    def products(self) -> List[Product]:
        return list(self.data.values())

    def pop(self, product_id: int) -> Product:
        return self.data.pop(str(product_id))

    @model_serializer(mode="wrap")
    def serialize_category(self, standard_serializer: SerializerFunctionWrapHandler) -> Dict[str, Any]:
        result = standard_serializer(self)
        result["products"] = list(result.pop("data").values())
        return result

    def apply_limit(self, limit: int) -> None:
        if limit > len(self.data):
            return

        items_to_pop = list(self.data.keys())[limit:]
        for id in items_to_pop:
            self.data.pop(id)
        self.remaining = len(items_to_pop)


class OrganizedCategory(Category):
    organized: bool = True
    candidates: List[Product]
    alternatives: List[Product]
    unseen: UnseenStatistics
