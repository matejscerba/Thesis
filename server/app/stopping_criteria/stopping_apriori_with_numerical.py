import itertools
from typing import List, Set, ClassVar, Tuple, Dict

import pandas as pd

from app.attributes.attribute import AttributeName, FilterValue, MultiFilterItem, Attribute, AttributeType
from app.data_loader import DataLoader
from app.products.stopping_criteria import StoppingCriterionItem
from app.stopping_criteria import StoppingAprioriStoppingCriteria
from app.stopping_criteria.abstract import StoppingCriteriaModel


class StoppingAprioriWithNumericalStoppingCriteria(StoppingAprioriStoppingCriteria):
    model: ClassVar[StoppingCriteriaModel] = StoppingCriteriaModel.STOPPING_APRIORI_WITH_NUMERICAL

    repeat_penalty: ClassVar[float] = 0.8

    @classmethod
    def _create_multi_filter_item(cls, attribute: Attribute, product: pd.Series) -> MultiFilterItem:
        if attribute.type == AttributeType.NUMERICAL and attribute.continuous:
            return MultiFilterItem(
                attribute_name=attribute.full_name,
                filter=attribute.get_range_filter_value(value=product[attribute.full_name]),
            )
        else:
            return MultiFilterItem(
                attribute_name=attribute.full_name, filter=FilterValue(options={product[attribute.full_name]})
            )

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
        all_attributes = DataLoader.load_attributes(category_name=category_name)

        items = []
        for S_size in range(1, 4):
            for attribute_names in itertools.combinations(important_attributes, S_size):
                for a_index in range(len(attribute_names)):
                    S_attributes = list(attribute_names)
                    a_attribute = S_attributes.pop(a_index)
                    S_all: Set[Tuple[MultiFilterItem, ...]] = set()
                    a_all: Set[MultiFilterItem] = set()
                    for _, row in candidates.iterrows():
                        if pd.isna([row[attribute_name] for attribute_name in attribute_names]).any():
                            continue
                        S_all.add(
                            tuple(
                                cls._create_multi_filter_item(
                                    attribute=all_attributes.attributes[attribute_name], product=row
                                )
                                for attribute_name in S_attributes
                            )
                        )
                        a_all.add(
                            cls._create_multi_filter_item(attribute=all_attributes.attributes[a_attribute], product=row)
                        )
                    for S in S_all:
                        for a in a_all:
                            try:
                                filtered_candidate_ids = {
                                    id
                                    for id in ProductHandler.filter_products_in_set(
                                        category_name=category_name,
                                        filter=[*S, a],
                                        ids=candidate_ids,
                                    )["id"].values
                                }
                            except KeyError:
                                filtered_candidate_ids = set()
                            item = StoppingCriterionItem(
                                support_set=list(S),
                                attribute_value=[a],
                                num_products=ProductHandler.count_products(
                                    category_name=category_name,
                                    filter=[*S, a],
                                    candidate_ids=candidate_ids,
                                    discarded_ids=discarded_ids,
                                ),
                                metric=StoppingCriterionItem.compute_metric(
                                    num_support_candidates=ProductHandler.count_products_in_set(
                                        category_name=category_name, filter=list(S), ids=candidate_ids
                                    ),
                                    num_all_candidates=ProductHandler.count_products_in_set(
                                        category_name=category_name, filter=[*S, a], ids=candidate_ids
                                    ),
                                    num_all_discarded=ProductHandler.count_products_in_set(
                                        category_name=category_name, filter=[*S, a], ids=discarded_ids
                                    ),
                                ),
                                candidate_ids=StoppingCriterionItem.encode_candidate_ids(
                                    candidate_ids=filtered_candidate_ids
                                ),
                            )
                            items.append(item)
        return items

    @classmethod
    def post_process(cls, initial_items: List[StoppingCriterionItem]) -> List[StoppingCriterionItem]:
        items = super().post_process(initial_items=initial_items)

        penalties: Dict[int, float] = {}
        for item in items:
            item_hash = item.get_attributes_hash()
            if item_hash not in penalties:
                penalties[item_hash] = cls.repeat_penalty
            else:
                item.metric *= penalties[item_hash]
                penalties[item_hash] *= cls.repeat_penalty

        return items
