import functools
import itertools
import logging
import time
from typing import List, Set, ClassVar, Tuple, Optional, Any

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
    @functools.lru_cache(maxsize=1000)
    def _create_multi_filter_item(
        cls, category_name: str, attribute: Attribute, value: Any, candidate_ids_encoded: str
    ) -> MultiFilterItem:
        from app.data_loader import DataLoader

        candidate_ids = {int(id_str) for id_str in candidate_ids_encoded.split("_")}

        if attribute.type == AttributeType.NUMERICAL and attribute.continuous:
            candidates = DataLoader.load_products(
                category_name=category_name, usecols=[attribute.full_name], userows=candidate_ids
            )
            products = DataLoader.load_products(category_name=category_name, usecols=[attribute.full_name])
            return MultiFilterItem(
                attribute_name=attribute.full_name,
                filter=attribute.get_range_filter_value(
                    value=value,
                    initial_value=candidates[attribute.full_name].median(),
                    products=products,
                ),
            )
        else:
            return MultiFilterItem(attribute_name=attribute.full_name, filter=FilterValue(options={value}))

    @classmethod
    def _generate_items(
        cls, category_name: str, candidate_ids: Set[int], discarded_ids: Set[int], important_attributes: List[str]
    ) -> List[StoppingCriterionItem]:
        from app.products.handler import ProductHandler

        start = time.monotonic()
        candidates = DataLoader.load_products(
            category_name=category_name,
            usecols=[AttributeName.PRICE.value, *important_attributes],
            userows=candidate_ids,
        )
        candidate_ids_encoded = "_".join([f"{id}" for id in sorted(candidate_ids)])
        all_attributes = DataLoader.load_attributes(category_name=category_name)
        logger.warning(f"loading: {time.monotonic() - start}")

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
                    start = time.monotonic()
                    for _, row in candidates.iterrows():
                        if pd.isna([row[attribute_name] for attribute_name in attribute_names]).any():
                            continue
                        S_all.add(
                            tuple(
                                cls._create_multi_filter_item(
                                    category_name=category_name,
                                    attribute=all_attributes.attributes[attribute_name],
                                    value=row[attribute_name],
                                    candidate_ids_encoded=candidate_ids_encoded,
                                )
                                for attribute_name in S_attributes
                            )
                        )
                        a_all.add(
                            cls._create_multi_filter_item(
                                category_name=category_name,
                                attribute=all_attributes.attributes[a_attribute],
                                value=row[a_attribute],
                                candidate_ids_encoded=candidate_ids_encoded,
                            )
                        )
                    logger.warning(f"all: {time.monotonic() - start}")
                    start = time.monotonic()
                    for S in S_all:
                        for a in a_all:
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
                                candidate_ids="",
                            )
                            items.append(item)
                    logger.warning(f"items: {time.monotonic() - start}")
        logger.warning(f"loops {loops}")
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
