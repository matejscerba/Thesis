from typing import Optional

from pydantic import BaseModel


class Product(BaseModel):
    id: int
    name: str
    price: float
    price_no_vat: Optional[float]
    availability: str
