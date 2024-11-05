from typing import List, Set

from pydantic import BaseModel, Field

from app.attributes.attribute import MultiFilterItem


class StoppingCriterionItem(BaseModel):
    support_set: List[MultiFilterItem]
    attribute_value: List[MultiFilterItem]
    num_products: int
    metric: float
    candidate_ids: str = Field(default=..., exclude=True)

    @classmethod
    def encode_candidate_ids(cls, candidate_ids: Set[int]) -> str:
        return "_".join(map(str, sorted(candidate_ids)))

    @classmethod
    def compute_metric(cls, num_support_candidates: int, num_all_candidates: int, num_all_discarded: int) -> float:
        try:
            return (num_all_candidates - num_all_discarded) / num_support_candidates
        except ZeroDivisionError:
            return 0

    def get_attributes_hash(self) -> int:
        attributes = [*self.support_set, *self.attribute_value]
        attributes.sort(key=lambda item: item.attribute_name)
        return hash(tuple(attributes))


class StoppingCriteria(BaseModel):
    preference_detected: bool
    reached: bool
    items: List[StoppingCriterionItem]
