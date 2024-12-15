from typing import List, Set, Tuple

from pydantic import BaseModel, Field

from app.attributes.attribute import MultiFilterItem


class StoppingCriterionItem(BaseModel):
    support_set: List[MultiFilterItem]
    attribute_value: List[MultiFilterItem]
    num_products: int
    metric: float
    candidate_ids: str = Field(default=..., exclude=True)

    @property
    def metric_with_complexity(self) -> Tuple[float, int]:
        return self.metric, -self.complexity  # Smaller complexity ~ better, hence the - sign

    @property
    def attributes(self) -> Set[MultiFilterItem]:
        return {*self.support_set, *self.attribute_value}

    @property
    def complexity(self) -> int:
        return len(self.support_set) + len(self.attribute_value)

    @classmethod
    def encode_candidate_ids(cls, candidate_ids: Set[int]) -> str:
        return "_".join(map(str, sorted(candidate_ids)))

    @classmethod
    def compute_metric(cls, num_support_candidates: int, num_all_candidates: int, num_all_discarded: int) -> float:
        try:
            return (num_all_candidates - num_all_discarded) / num_support_candidates
        except ZeroDivisionError:
            return 0

    def similarity(self, rhs: "StoppingCriterionItem") -> float:
        return len(self.attributes.intersection(rhs.attributes)) / len(self.attributes.union(rhs.attributes))

    def get_attributes_hash(self) -> int:
        attributes = [*self.support_set, *self.attribute_value]
        attributes.sort(key=lambda item: item.attribute_name)
        return hash(tuple(attributes))


class StoppingCriteria(BaseModel):
    items: List[StoppingCriterionItem]
