import itertools
import logging
import operator
from typing import List, Set, ClassVar, Optional, Tuple, Any, Dict

import pandas as pd

from app.attributes.attribute import AttributeName, Attribute, FilterValue, MultiFilterItem
from app.data_loader import DataLoader
from app.products.stopping_criteria import StoppingCriteria, StoppingCriterionItem
from app.stopping_criteria.abstract import AbstractStoppingCriteria, StoppingCriteriaModel

logger = logging.getLogger()


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
                            try:
                                filtered_candidate_ids = {
                                    id
                                    for id in ProductHandler.filter_products_in_set(
                                        category_name=category_name,
                                        filter=[*S_filter, a_filter],
                                        ids=candidate_ids,
                                    )["id"].values
                                }
                            except KeyError:
                                filtered_candidate_ids = set()
                            item = StoppingCriterionItem(
                                support_set=S_filter,
                                attribute_value=[a_filter],
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
                                    candidate_ids=filtered_candidate_ids
                                ),
                            )
                            items.append(item)
        return items

    @classmethod
    def post_process(cls, initial_items: List[StoppingCriterionItem]) -> List[StoppingCriterionItem]:
        items = [item for item in initial_items if item.num_products > 0]

        grouped_items: Dict[str, List[StoppingCriterionItem]] = {}
        # Each grouped item value contains list of items with the same metric and the same length (both maximum)
        for item in items:
            if item.candidate_ids not in grouped_items or len(grouped_items[item.candidate_ids]) == 0:
                grouped_items[item.candidate_ids] = [item]
            elif item.metric > grouped_items[item.candidate_ids][0].metric:
                grouped_items[item.candidate_ids] = [item]
            elif item.metric == grouped_items[item.candidate_ids][0].metric:
                if len(item.support_set) > len(grouped_items[item.candidate_ids][0].support_set):
                    grouped_items[item.candidate_ids] = [item]
                elif len(item.support_set) == len(grouped_items[item.candidate_ids][0].support_set):
                    grouped_items[item.candidate_ids].append(item)

        items = []
        for values in grouped_items.values():
            attribute_values: Dict[str, MultiFilterItem] = {}
            support_attributes = set()
            for item in values:
                assert len(item.attribute_value) == 1
                support_attributes.update(set([attribute.attribute_name for attribute in item.support_set]))
                attribute_name = item.attribute_value[0].attribute_name
                attribute_item = item.attribute_value[0]
                if attribute_name not in attribute_values:
                    attribute_values[attribute_name] = attribute_item
                else:
                    attribute_values_filter = attribute_values[attribute_name].filter
                    if (
                        attribute_item.filter.lower_bound is not None
                        and attribute_values_filter.lower_bound is not None
                        and attribute_item.filter.lower_bound <= attribute_values_filter.lower_bound
                        and attribute_item.filter.upper_bound is not None
                        and attribute_values_filter.upper_bound is not None
                        and attribute_item.filter.upper_bound >= attribute_values_filter.upper_bound
                    ):
                        attribute_values[attribute_name] = attribute_item
                    if (
                        attribute_item.filter.options is not None
                        and attribute_values_filter.options is not None
                        and attribute_values_filter.options <= attribute_item.filter.options
                    ):
                        attribute_values[attribute_name] = attribute_item

            if support_attributes == set(attribute_values.keys()):
                items.append(
                    StoppingCriterionItem(
                        support_set=[],
                        attribute_value=list(attribute_values.values()),
                        num_products=values[0].num_products,
                        metric=values[0].metric,
                        candidate_ids=values[0].candidate_ids,
                    )
                )
            else:
                items.extend(values)

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

        items = [item for item in items if item.metric > cls.preference_threshold]

        items.sort(key=operator.attrgetter("metric_with_complexity"), reverse=True)

        items = cls.post_process(initial_items=items)

        return StoppingCriteria(items=items)
