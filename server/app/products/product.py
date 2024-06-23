from typing import Optional

import pandas as pd
from pydantic import BaseModel

from app.attributes.attribute import AttributeName


class Product(BaseModel):
    id: int
    name: str
    price: float
    rating: Optional[float]

    @classmethod
    def from_dataframe_row(cls, id: int, row: pd.Series) -> "Product":
        return Product(
            id=id,
            name=row[AttributeName.NAME.value],
            price=row[AttributeName.PRICE.value],
            rating=row[AttributeName.RATING.value],
        )
