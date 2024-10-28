import itertools
from typing import List, Set, ClassVar, Optional, Tuple, Any, Dict

import pandas as pd

from app.attributes.attribute import AttributeName, Attribute, FilterValue, MultiFilterItem
from app.data_loader import DataLoader
from app.products.stopping_criteria import StoppingCriteria, StoppingCriterionItem
from app.stopping_criteria.abstract import AbstractStoppingCriteria, StoppingCriteriaModel


class StoppingAprioriStoppingCriteria(AbstractStoppingCriteria):
    model: ClassVar[StoppingCriteriaModel] = StoppingCriteriaModel.STOPPING_APRIORI

    @classmethod
    def _get_filter_value(cls, attribute: Attribute, candidates: pd.DataFrame) -> Optional[FilterValue]:
        counts = candidates[attribute.full_name].value_counts()
        if len(counts) == 0:
            return None

        return FilterValue(options={counts.index[0]})

    @classmethod
    def _generate_items(
        cls, category_name: str, candidate_ids: Set[int], discarded_ids: Set[int], important_attributes: List[str]
    ) -> List[StoppingCriterionItem]:
        from app.products.handler import ProductHandler

        candidates = DataLoader.load_products(
            category_name=category_name,
            usecols=[AttributeName.PRICE.value, *important_attributes],
            userows=candidate_ids,
        )

        items = []
        for S_size in range(1, 4):
            for attribute_names in itertools.combinations(important_attributes, S_size):
                for a_index in range(len(attribute_names)):
                    S_attributes = list(attribute_names)
                    a_attribute = S_attributes.pop(a_index)
                    S_all: Set[Tuple[Tuple[str, Any], ...]] = set()
                    a_all: Set[Tuple[str, Any]] = set()
                    for _, row in candidates.iterrows():
                        if pd.isna([row[attribute_name] for attribute_name in attribute_names]).any():
                            continue
                        S_all.add(tuple([(attribute_name, row[attribute_name]) for attribute_name in S_attributes]))
                        a_all.add((a_attribute, row[a_attribute]))
                    for S in S_all:
                        for a in a_all:
                            S_filter = [
                                MultiFilterItem(attribute_name=item[0], filter=FilterValue(options={item[1]}))
                                for item in S
                            ]
                            a_filter = MultiFilterItem(attribute_name=a[0], filter=FilterValue(options={a[1]}))
                            item = StoppingCriterionItem(
                                support_set=S_filter,
                                attribute_value=a_filter,
                                num_products=ProductHandler.count_products(
                                    category_name=category_name,
                                    filter=[*S_filter, a_filter],
                                    candidate_ids=candidate_ids,
                                    discarded_ids=discarded_ids,
                                ),
                                metric=StoppingCriterionItem.compute_metric(
                                    num_support_candidates=ProductHandler.count_products_in_set(
                                        category_name=category_name, filter=S_filter, ids=candidate_ids
                                    ),
                                    num_all_candidates=ProductHandler.count_products_in_set(
                                        category_name=category_name, filter=[*S_filter, a_filter], ids=candidate_ids
                                    ),
                                    num_all_discarded=ProductHandler.count_products_in_set(
                                        category_name=category_name, filter=[*S_filter, a_filter], ids=discarded_ids
                                    ),
                                ),
                                candidate_ids=StoppingCriterionItem.encode_candidate_ids(
                                    candidate_ids={
                                        id
                                        for id in ProductHandler.filter_products_in_set(
                                            category_name=category_name,
                                            filter=[*S_filter, a_filter],
                                            ids=candidate_ids,
                                        )["id"].values
                                    }
                                ),
                            )
                            items.append(item)
        return items

    @classmethod
    def generate(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> StoppingCriteria:
        items = cls._generate_items(
            category_name=category_name,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
            important_attributes=important_attributes,
        )

        preference_detected = len([item.metric >= cls.preference_threshold for item in items]) > 0

        # Filter items so that only the
        items = [item for item in items if item.num_products > 0]

        grouped_items: Dict[str, StoppingCriterionItem] = {}
        for item in items:
            if item.candidate_ids not in grouped_items:
                grouped_items[item.candidate_ids] = item
            elif item.metric > grouped_items[item.candidate_ids].metric:
                grouped_items[item.candidate_ids] = item
            elif item.metric == grouped_items[item.candidate_ids].metric and len(item.support_set) > len(
                grouped_items[item.candidate_ids].support_set
            ):
                grouped_items[item.candidate_ids] = item

        items = sorted(list(grouped_items.values()), key=lambda item: item.metric, reverse=True)

        if len(items) > 5:
            items = items[:5]

        return StoppingCriteria(preference_detected=preference_detected, reached=len(items) == 0, items=items)
