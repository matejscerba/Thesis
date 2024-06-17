from typing import Optional, Dict

from pydantic import BaseModel


class Attribute(BaseModel):
    full_name: str
    name: str
    unit: Optional[str]

    @classmethod
    def from_raw_string(cls, value: str) -> "Attribute":
        name = full_name = value
        unit = None
        if value.endswith("]"):
            unit = value.split("[")[-1].split("]")[0]
            name = "[".join(value.split("[")[:-1]).strip()
        return Attribute(full_name=full_name, name=name, unit=unit)


class CategoryAttributes(BaseModel):
    attributes: Dict[str, Attribute]

    @classmethod
    def from_data(cls, data: Dict[str, str]) -> "CategoryAttributes":
        return CategoryAttributes(attributes={id: Attribute.from_raw_string(value=name) for id, name in data.items()})
