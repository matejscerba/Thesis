import itertools
import logging
import operator
import os
from typing import List, Set, ClassVar, Tuple, Optional, Dict, Any

import pandas as pd

from app.attributes.attribute import AttributeName, FilterValue, MultiFilterItem, Attribute, AttributeType
from app.data_loader import DataLoader
from app.products.stopping_criteria import StoppingCriterionItem, StoppingCriteria
from app.stopping_criteria.abstract import AbstractStoppingCriteriaGenerator, StoppingCriteriaGeneratorModel

logger = logging.getLogger()


class StoppingAprioriStoppingCriteria(AbstractStoppingCriteriaGenerator):
    """This class holds the implementation of an Apriori-like stopping criteria generator.

    :param ClassVar[ExplanationsModel] model: the model of this stopping criteria generator
    :param ClassVar[int] STOPPING_CRITERIA_SIZE: the maximum number of stopping criteria items to generate
    """

    model: ClassVar[StoppingCriteriaGeneratorModel] = StoppingCriteriaGeneratorModel.STOPPING_APRIORI
    STOPPING_CRITERIA_SIZE: ClassVar[int] = int(os.environ.get("STOPPING_CRITERIA_SIZE", "5"))

    @classmethod
    def _create_multi_filter_item(
        cls, category_name: str, attribute: Attribute, product: pd.Series, candidate_ids: Set[int]
    ) -> MultiFilterItem:
        """Creates a filter based on attribute and its value that the product satisfies.

        :param str category_name: the name of the category
        :param Attribute attribute: the attribute for which to create the filter
        :param pd.Series product: the product which should satisfy the filter
        :param Set[int] candidate_ids: the IDs of candidate products
        :return: filter that the given product satisfies
        :rtype: MultiFilterItem
        """
        from app.data_loader import DataLoader

        if attribute.type == AttributeType.NUMERICAL and attribute.continuous:
            candidates = DataLoader.load_products(
                category_name=category_name, usecols=[attribute.full_name], userows=candidate_ids
            )
            products = DataLoader.load_products(category_name=category_name, usecols=[attribute.full_name])
            values = candidates[attribute.full_name].sort_values().reset_index(drop=True)

            assert len(values) > 0

            # We need median value to exist, standard pd.median() does not guarantee that
            median = values.iloc[(len(values) - 1) // 2]
            return MultiFilterItem(
                attribute_name=attribute.full_name,
                filter=attribute.get_range_filter_value(
                    value=product[attribute.full_name],
                    products=products,
                    initial_value=median,
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
        """Generate stopping criteria items.

        :param str category_name: the name of the category
        :param Set[int] candidate_ids: the IDs of candidate products
        :param Set[int] discarded_ids: the IDs of discarded products
        :param List[str] important_attributes: the important attributes
        :return: list of stopping criteria items
        :rtype: List[StoppingCriterionItem]
        """
        from app.products.handler import ProductHandler

        candidates = DataLoader.load_products(
            category_name=category_name,
            usecols=[AttributeName.PRICE.value, *important_attributes],
            userows=candidate_ids,
        )
        all_attributes = DataLoader.load_attributes(category_name=category_name)

        # Get all possible filters that cover the candidates and get ids of not yet seen products, candidates and
        # discarded products that satisfy each filter

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

        # Generate combinations of filters (`support set` and `attribute value`) to create stopping criteria items rules
        # in the form '`support set` implies `attribute value`' ("Out of products satisfying support set, you prefer
        # products with `attribute value`")

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
                            )
                            items.append(item)
        return items

    @classmethod
    def _compute_max_similarity(cls, item: StoppingCriterionItem, items: List[StoppingCriterionItem]) -> float:
        """Computes maximum similarity of a given item and a given list of items.

        :param StoppingCriterionItem item: item for which to compute maximum similarity
        :param List[StoppingCriterionItem] items: items for which to compute maximum similarity against
        :return: maximum similarity of a given item and a given list of items
        :rtype: float
        """
        max_similarity = 0.0
        for rhs in items:
            similarity = item.similarity(rhs=rhs)
            if similarity > max_similarity:
                max_similarity = similarity
        return max_similarity

    @classmethod
    def post_process(cls, initial_items: List[StoppingCriterionItem]) -> List[StoppingCriterionItem]:
        """Performs post-processing of initial stopping criteria.

        The post-processing reduces metrics of similar items to increase diversity in the presented stopping criteria.

        :param List[StoppingCriterionItem] initial_items: initial stopping criteria
        :return: post-processed stopping criteria
        :rtype: List[StoppingCriteria]
        """
        result = []

        if len(initial_items) > 0:
            for _ in range(cls.STOPPING_CRITERIA_SIZE):
                best_item: Optional[Tuple[StoppingCriterionItem, float]] = None
                added = False
                for item in initial_items:
                    if item in result:
                        # Item is already selected, skip it
                        continue
                    if best_item is not None:
                        if item.metric < best_item[1]:
                            # Item's metric is lower than the best item's reduced metric, we can only reduce its metric,
                            # so there is no need to continue (all subsequent items have lower metric)
                            result.append(best_item[0])
                            added = True
                            break
                    similarity = cls._compute_max_similarity(item=item, items=result)
                    updated_metric = item.metric * (1 - similarity)
                    if best_item is None:
                        best_item = item, updated_metric
                    else:
                        if updated_metric > best_item[1]:
                            best_item = item, updated_metric

                # Add best item if none was added in the for loop
                if not added and best_item is not None:
                    result.append(best_item[0])

        return result

    @classmethod
    def generate(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> StoppingCriteria:
        """Generates stopping criteria based on candidates and discarded products.

        :param str category_name: name of the category
        :param Set[int] candidate_ids: IDs of the candidate products
        :param Set[int] discarded_ids: IDs of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: Stopping criteria that are good enough
        :rtype: StoppingCriteria
        """
        items = cls._generate_items(
            category_name=category_name,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
            important_attributes=important_attributes,
        )

        # Filter out bad items
        items = [item for item in items if item.metric > cls.PREFERENCE_THRESHOLD]

        # Sort items by metric
        items.sort(key=operator.attrgetter("metric_with_complexity"), reverse=True)

        # Post-process items
        items = cls.post_process(initial_items=items)

        return StoppingCriteria(items=items)
