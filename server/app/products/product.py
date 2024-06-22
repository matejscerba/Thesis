import pandas as pd
from pydantic import BaseModel

from app.attributes.attribute import AttributeName


class Product(BaseModel):
    id: int
    name: str
    price: float

    @classmethod
    def from_dataframe_row(cls, id: int, row: pd.Series) -> "Product":
        return Product(id=id, name=row[AttributeName.NAME], price=row[AttributeName.PRICE])
