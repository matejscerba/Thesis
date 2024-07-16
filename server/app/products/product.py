from typing import Optional

import pandas as pd
from pydantic import BaseModel

from app.attributes.attribute import AttributeName


class Product(BaseModel):
    """This class represents a product.

    :param int id: id of the product
    :param str name: name of the product
    :param float price: price of the product
    :param Optional[float] rating: rating of the product
    """

    id: int
    name: str
    price: float
    rating: Optional[float]

    @classmethod
    def from_dataframe_row(cls, id: int, row: pd.Series) -> "Product":
        """Loads the product from a dataframe row.

        :param int id: id of the product
        :param pd.Series row: row of a dataframe representing the product
        :return: parsed product
        :rtype: Product
        """
        return Product(
            id=id,
            name=row[AttributeName.NAME.value],
            price=row[AttributeName.PRICE.value],
            rating=row[AttributeName.RATING.value],
        )
