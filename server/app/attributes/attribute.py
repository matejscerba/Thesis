from typing import Optional, Dict, Any, List

from pydantic import BaseModel


class Attribute(BaseModel):
    full_name: str
    name: str
    unit: Optional[str]
    group: str
    type: str

    @classmethod
    def from_data(cls, value: Dict[str, Any]) -> "Attribute":
        name = full_name = value["name"]
        unit = None
        if full_name.endswith("]"):
            unit = full_name.split("[")[-1].split("]")[0]
            name = "[".join(full_name.split("[")[:-1]).strip()
        return Attribute(full_name=full_name, name=name, group=value["group"], type=value["type"], unit=unit)


class CategoryAttributes(BaseModel):
    attributes: Dict[int, Attribute]

    @classmethod
    def from_data(cls, data: List[Dict[str, Any]]) -> "CategoryAttributes":
        return CategoryAttributes(
            attributes={attribute["id"]: Attribute.from_data(value=attribute) for attribute in data}
        )
