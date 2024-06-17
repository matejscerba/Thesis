from typing import Optional, Dict, Any, cast

import pandas as pd
from pydantic import BaseModel


class Product(BaseModel):
    id: int
    name: str
    price: Optional[float]
    price_no_vat: Optional[float]
    availability: str
    attributes: Dict[str, Any]

    @classmethod
    def from_dataframe_row(cls, id: int, row: pd.Series) -> "Product":
        data = {key: (None if pd.isna(value) else value) for key, value in row.items()}
        return Product(
            id=id,
            name=cast(str, data.pop("name")),
            price=data.pop("price"),
            price_no_vat=data.pop("price_no_vat"),
            availability=cast(str, data.pop("availability")),
            attributes=cast(Dict[str, Any], data),
        )
