from typing import List, Dict, Any

import pandas as pd
from pydantic import BaseModel, model_serializer
from pydantic_core.core_schema import SerializerFunctionWrapHandler

from app.products.product import Product
from app.products.unseen_statistics import UnseenStatistics


class Category(BaseModel):
    """This class represents a category of products.

    :param bool organized: whether the category is organized
    """

    organized: bool


class UnorganizedCategory(Category):
    """This class represents an unorganized category of products.

    :param bool organized: whether the category is organized, default `False`
    :param Dict[str, Product] data: the products inside this category, keys are the string representations of the
    product ids
    :param int remaining: number of remaining products if limit has been applied, default `0`
    """

    organized: bool = False
    data: Dict[str, Product]
    remaining: int = 0

    @classmethod
    def from_dataframe(cls, df: pd.DataFrame) -> "UnorganizedCategory":
        """Loads the category from a dataframe.

        :param pd.DataFrame df: dataframe representing the products of a category
        :return: instance of the category
        :rtype: UnorganizedCategory
        """
        return UnorganizedCategory(
            data={str(row["id"]): Product.from_dataframe_row(id=int(row["id"]), row=row) for _, row in df.iterrows()}
        )

    @property
    def products(self) -> List[Product]:
        """A property containing list of products

        :return: list of products in this category
        :rtype: List[Product]
        """
        return list(self.data.values())

    def pop(self, product_id: int) -> Product:
        """Pop (remove and return) product of a give id.

        :param int product_id: id of the product to pop from this category
        :return: popped product
        :rtype: Product
        """
        return self.data.pop(str(product_id))

    @model_serializer(mode="wrap")
    def serialize_category(self, standard_serializer: SerializerFunctionWrapHandler) -> Dict[str, Any]:
        """Pydantic serializer that replaces data (dictionary) with list of products during Pydantic serialization.

        :param SerializerFunctionWrapHandler standard_serializer: standard Pydantic serializer
        :return: serialized data
        :rtype: Dict[str, Any]
        """
        result = standard_serializer(self)
        result["products"] = list(result.pop("data").values())
        return result

    def apply_limit(self, limit: int) -> None:
        """Applies limit to this category, keeps only `limit` products.

        :param int limit: number of products to keep in this category
        :return: None
        """
        if limit > len(self.data):
            return

        items_to_pop = list(self.data.keys())[limit:]
        for id in items_to_pop:
            self.data.pop(id)
        self.remaining = len(items_to_pop)


class OrganizedCategory(Category):
    """This class represents an organized category of products.

    :param bool organized: whether the category is organized, default `True`
    :param List[Product] candidates: candidate products
    :param List[Product] alternatives: alternative products
    :param UnseenStatistics unseen: statistics about the unseen products
    """

    organized: bool = True
    candidates: List[Product]
    alternatives: List[Product]
    unseen: UnseenStatistics
