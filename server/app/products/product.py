from typing import Optional, Dict, Any, cast

import pandas as pd
from pydantic import BaseModel


class ProductExplanation(BaseModel):
    message: str


class Product(BaseModel):
    id: int
    attributes: Dict[str, Any]

    @classmethod
    def from_dataframe_row(cls, id: int, row: pd.Series) -> "Product":
        data = {key: (None if pd.isna(value) else value) for key, value in row.items()}
        return Product(
            id=id,
            attributes=cast(Dict[str, Any], data),
        )
