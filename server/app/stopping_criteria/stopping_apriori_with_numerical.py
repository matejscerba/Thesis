import itertools
import logging
from typing import List, Set, ClassVar, Tuple, Optional, Dict, Any

import pandas as pd

from app.attributes.attribute import AttributeName, FilterValue, MultiFilterItem, Attribute, AttributeType
from app.data_loader import DataLoader
from app.products.stopping_criteria import StoppingCriterionItem
from app.stopping_criteria import StoppingAprioriStoppingCriteria
from app.stopping_criteria.abstract import StoppingCriteriaModel

logger = logging.getLogger()


class StoppingAprioriWithNumericalStoppingCriteria(StoppingAprioriStoppingCriteria):
    model: ClassVar[StoppingCriteriaModel] = StoppingCriteriaModel.STOPPING_APRIORI_WITH_NUMERICAL

    repeat_penalty: ClassVar[float] = 0.8

    @classmethod
    def _create_multi_filter_item(
        cls, category_name: str, attribute: Attribute, product: pd.Series, candidate_ids: Set[int]
    ) -> MultiFilterItem:
        from app.data_loader import DataLoader

        if attribute.type == AttributeType.NUMERICAL and attribute.continuous:
            candidates = DataLoader.load_products(
                category_name=category_name, usecols=[attribute.full_name], userows=candidate_ids
            )
            products = DataLoader.load_products(category_name=category_name, usecols=[attribute.full_name])
            values = candidates[attribute.full_name].sort_values().reset_index(drop=True)

            assert len(values) > 0

            median = values.iloc[(len(values) - 1) // 2]
            return MultiFilterItem(
                attribute_name=attribute.full_name,
                filter=attribute.get_range_filter_value(
                    value=product[attribute.full_name],
                    initial_value=median,
                    products=products,
                ),
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

        multi_filter_items: Dict[Tuple[str, Any], MultiFilterItem] = {}
        filter_ids_products: Dict[MultiFilterItem, Set[int]] = {}
        filter_ids_candidates: Dict[MultiFilterItem, Set[int]] = {}
        filter_ids_discarded: Dict[MultiFilterItem, Set[int]] = {}

        for attribute_name in important_attributes:
            for _, row in candidates.iterrows():
                attribute_value = row[attribute_name]
                if (attribute_name, attribute_value) in multi_filter_items:
                    # Multi filter item is already computed for this attribute and its value
                    continue
                if pd.isna(attribute_value):
                    # Value is not valid, skip it
                    continue
                multi_filter_item = cls._create_multi_filter_item(
                    category_name=category_name,
                    attribute=all_attributes.attributes[attribute_name],
                    product=row,
                    candidate_ids=candidate_ids,
                )
                multi_filter_items[attribute_name, attribute_value] = multi_filter_item
                filter_ids_products[multi_filter_item] = ProductHandler.get_product_ids(
                    category_name=category_name,
                    filter=[multi_filter_item],
                    candidate_ids=candidate_ids,
                    discarded_ids=discarded_ids,
                )
                filter_ids_candidates[multi_filter_item] = ProductHandler.get_product_ids_in_set(
                    category_name=category_name, filter=[multi_filter_item], ids=candidate_ids
                )
                filter_ids_discarded[multi_filter_item] = ProductHandler.get_product_ids_in_set(
                    category_name=category_name, filter=[multi_filter_item], ids=discarded_ids
                )

        items = []
        loops = 0
        for S_size in range(1, 4):
            for attribute_names in itertools.combinations(important_attributes, S_size):
                for a_index in range(len(attribute_names)):
                    loops += 1
                    S_attributes = list(attribute_names)
                    a_attribute = S_attributes.pop(a_index)
                    S_all: Set[Tuple[MultiFilterItem, ...]] = set()
                    a_all: Set[MultiFilterItem] = set()
                    for _, row in candidates.iterrows():
                        skip = False
                        for attribute_name in attribute_names:
                            if (attribute_name, row[attribute_name]) not in multi_filter_items:
                                skip = True
                        if skip:
                            continue
                        S_all.add(
                            tuple(
                                multi_filter_items[attribute_name, row[attribute_name]]
                                for attribute_name in S_attributes
                            )
                        )
                        a_all.add(multi_filter_items[a_attribute, row[a_attribute]])
                    for S in S_all:
                        for a in a_all:
                            item = StoppingCriterionItem(
                                support_set=list(S),
                                attribute_value=[a],
                                num_products=len(
                                    set.intersection(*[filter_ids_products[filter_item] for filter_item in [*S, a]])
                                ),
                                metric=StoppingCriterionItem.compute_metric(
                                    num_support_candidates=(
                                        len(
                                            set.intersection(*[filter_ids_candidates[filter_item] for filter_item in S])
                                        )
                                        if len(S) > 0
                                        else len(candidate_ids)
                                    ),
                                    num_all_candidates=len(
                                        set.intersection(
                                            *[filter_ids_candidates[filter_item] for filter_item in [*S, a]]
                                        )
                                    ),
                                    num_all_discarded=len(
                                        set.intersection(
                                            *[filter_ids_discarded[filter_item] for filter_item in [*S, a]]
                                        )
                                    ),
                                ),
                                candidate_ids="",
                            )
                            items.append(item)
        return items

    # @classmethod
    # def post_process(cls, initial_items: List[StoppingCriterionItem]) -> List[StoppingCriterionItem]:
    #     items = super().post_process(initial_items=initial_items)
    #
    #     penalties: Dict[int, float] = {}
    #     for item in items:
    #         item_hash = item.get_attributes_hash()
    #         if item_hash not in penalties:
    #             penalties[item_hash] = cls.repeat_penalty
    #         else:
    #             item.metric *= penalties[item_hash]
    #             penalties[item_hash] *= cls.repeat_penalty
    #
    #     return items

    @classmethod
    def _compute_max_similarity(cls, item: StoppingCriterionItem, items: List[StoppingCriterionItem]) -> float:
        max_similarity = 0.0
        for rhs in items:
            similarity = item.similarity(rhs=rhs)
            if similarity > max_similarity:
                max_similarity = similarity
        return max_similarity

    @classmethod
    def post_process(cls, initial_items: List[StoppingCriterionItem]) -> List[StoppingCriterionItem]:
        result = []

        if len(initial_items) > 0:
            for _ in range(5):
                best_item: Optional[Tuple[StoppingCriterionItem, float]] = None
                for item in initial_items:
                    if best_item is not None:
                        if item.metric < best_item[1]:
                            # Item's metric is lower than best item's reduced metric, we can only reduce its metric, so
                            # there is no need to continue (all subsequent items have lower metric)
                            result.append(best_item[0])
                            break
                    similarity = cls._compute_max_similarity(item=item, items=result)
                    updated_metric = item.metric * (1 - similarity)
                    if best_item is None:
                        best_item = item, updated_metric
                    else:
                        if updated_metric > best_item[1]:
                            best_item = item, updated_metric

        return result
