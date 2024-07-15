from typing import List, Dict, Any, Set

import numpy as np
import pandas as pd

from app.attributes.attribute import Attribute, AttributeType, AttributeOrder, AttributeName, CategoryAttributes
from app.data_loader import DataLoader
from app.products.explanations import (
    ProductAttributePosition,
    ProductExplanation,
    ProductAttributeExplanation,
    ProductExplanationMessage,
    ProductExplanationMessageCode,
)
from app.utils.attributes import expand_list_value, expand_list_values


class SetBasedRecommender:
    @classmethod
    def predict(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> List[int]:
        data = DataLoader.load_products(category_name=category_name, usecols=important_attributes)

        column_mapping: Dict[str, Any] = {}
        columns: List[str] = []
        for attribute in important_attributes:
            values = data[attribute].unique()
            column_mapping[attribute] = {}
            for item in values:
                if pd.isna(item):
                    continue
                column_mapping[attribute][item] = len(columns)
                columns.append(str(len(columns)))

        user_model = np.zeros(len(columns))
        for _, row in data.iterrows():
            if row["id"] in candidate_ids:
                rating = 1
            elif row["id"] in discarded_ids:
                rating = -1
            else:
                continue
            for attribute in important_attributes:
                if pd.isna(row[attribute]):
                    continue
                column_idx = column_mapping[attribute][row[attribute]]
                user_model[column_idx] += rating

        if len(candidate_ids) > 0 or len(discarded_ids) > 0:
            user_model = user_model / (len(candidate_ids) + len(discarded_ids))

        ratings = np.zeros((len(data), len(columns)))
        for idx, row in data.iterrows():
            for attribute in important_attributes:
                if pd.isna(row[attribute]):
                    continue
                column_idx = column_mapping[attribute][row[attribute]]
                ratings[idx, column_idx] = 1

        scores = np.sum(ratings * user_model, axis=-1)
        order = np.argsort(scores)[::-1]

        return [
            id for id in data["id"].to_numpy()[order].tolist() if id not in candidate_ids and id not in discarded_ids
        ]

    @classmethod
    def calculate_attribute_position_non_candidate(
        cls, category_name: str, attribute: Attribute, value: Any, candidates: pd.DataFrame
    ) -> ProductAttributePosition:
        if pd.isna(value) or len(candidates) == 0:
            return ProductAttributePosition.NEUTRAL

        all_values = candidates[attribute.full_name].dropna()

        if attribute.type == AttributeType.NUMERICAL and attribute.order is not None:
            lowest = (
                ProductAttributePosition.WORSE
                if attribute.order == AttributeOrder.ASCENDING
                else ProductAttributePosition.BETTER
            )
            highest = (
                ProductAttributePosition.BETTER
                if attribute.order == AttributeOrder.ASCENDING
                else ProductAttributePosition.WORSE
            )
            if value < all_values.min():
                return lowest
            elif value > all_values.max():
                return highest
            else:
                return ProductAttributePosition.RELEVANT
        if attribute.type == AttributeType.CATEGORICAL:
            if attribute.is_list:
                list_value = expand_list_value(value=value)
                all_values_values = expand_list_values(values=all_values.values.tolist())
                if not pd.isna(value) and len(set(list_value).intersection(set(all_values_values))) > 0:
                    return ProductAttributePosition.RELEVANT
            if value in all_values.values:
                return ProductAttributePosition.RELEVANT
        all_ratings = DataLoader.load_ratings(
            category_name=category_name, attribute_name=attribute.full_name, values=all_values
        )
        rating = DataLoader.load_rating(category_name=category_name, attribute_name=attribute.full_name, value=value)
        if rating is not None and all_ratings is not None:
            if rating < all_ratings.min():
                return ProductAttributePosition.LOWER_RATED
            if rating > all_ratings.max():
                return ProductAttributePosition.HIGHER_RATED

        return ProductAttributePosition.NEUTRAL

    @classmethod
    def calculate_attribute_position_candidate(
        cls, category_name: str, attribute: Attribute, value: Any, candidates: pd.DataFrame
    ) -> ProductAttributePosition:
        if pd.isna(value):
            return ProductAttributePosition.NEUTRAL

        all_values = candidates[attribute.full_name].dropna()
        unique_values = all_values.unique()
        if len(unique_values) <= 1:
            return ProductAttributePosition.NEUTRAL

        if attribute.type == AttributeType.NUMERICAL and attribute.order is not None:
            lowest = (
                ProductAttributePosition.WORST
                if attribute.order == AttributeOrder.ASCENDING
                else ProductAttributePosition.BEST
            )
            highest = (
                ProductAttributePosition.BEST
                if attribute.order == AttributeOrder.ASCENDING
                else ProductAttributePosition.WORST
            )
            if len(all_values[all_values == value]) == 1:
                if value == all_values.min():
                    return lowest
                if value == all_values.max():
                    return highest
        all_ratings = DataLoader.load_ratings(
            category_name=category_name, attribute_name=attribute.full_name, values=all_values
        )
        rating = DataLoader.load_rating(category_name=category_name, attribute_name=attribute.full_name, value=value)
        if rating is not None and all_ratings is not None:
            unique_ratings = all_ratings.unique()
            if len(unique_ratings) <= 1:
                return ProductAttributePosition.NEUTRAL

            if len(all_ratings[all_ratings == rating]) == 1:
                if rating == all_ratings.min():
                    return ProductAttributePosition.LOWEST_RATED
                if rating == all_ratings.max():
                    return ProductAttributePosition.HIGHEST_RATED

        return ProductAttributePosition.NEUTRAL

    @classmethod
    def _explain_candidate(
        cls,
        category_name: str,
        product: pd.Series,
        candidates: pd.DataFrame,
        all_attributes: CategoryAttributes,
        important_attributes: List[str],
    ) -> ProductExplanation:
        attributes = []
        for attribute_name in important_attributes:
            attribute = all_attributes.attributes[attribute_name]
            value = product[attribute_name]
            if attribute.is_list:
                value = expand_list_value(value)
            position = cls.calculate_attribute_position_candidate(
                category_name=category_name,
                attribute=all_attributes.attributes[attribute_name],
                value=product[attribute_name],
                candidates=candidates,
            )
            attributes.append(
                ProductAttributeExplanation(attribute=attribute, attribute_value=value, position=position)
            )
        return ProductExplanation(
            message=ProductExplanationMessage(code=ProductExplanationMessageCode.NONE),
            attributes=attributes,
            price_position=cls.calculate_attribute_position_candidate(
                category_name=category_name,
                attribute=all_attributes.attributes[AttributeName.PRICE.value],
                value=product[AttributeName.PRICE.value],
                candidates=candidates,
            ),
        )

    @classmethod
    def _is_better_than_all_candidates(
        cls,
        product: pd.Series,
        candidates: pd.DataFrame,
        all_attributes: CategoryAttributes,
    ) -> bool:
        numerical_attributes = all_attributes.get_numerical_attributes(include_price=False)
        numerical_columns = [col for col in candidates.columns if col in numerical_attributes]
        if len(numerical_columns) == 0:
            return False

        columns_map = np.array(
            [
                1 if numerical_attributes[attribute].order == AttributeOrder.ASCENDING else -1
                for attribute in numerical_columns
            ]
        )

        numerical_product = product[numerical_columns] * columns_map
        best_candidate = (candidates[numerical_columns] * columns_map).max(axis=0)
        return (numerical_product > best_candidate).all()

    @classmethod
    def _generate_explanation_message_non_candidate(
        cls,
        product: pd.Series,
        candidates: pd.DataFrame,
        all_attributes: CategoryAttributes,
    ) -> ProductExplanationMessage:
        code = ProductExplanationMessageCode.NONE
        if cls._is_better_than_all_candidates(product=product, candidates=candidates, all_attributes=all_attributes):
            code = ProductExplanationMessageCode.BETTER_THAN_ALL_CANDIDATES
        return ProductExplanationMessage(code=code)

    @classmethod
    def _explain_non_candidate(
        cls,
        category_name: str,
        product: pd.Series,
        candidates: pd.DataFrame,
        all_attributes: CategoryAttributes,
        important_attributes: List[str],
    ) -> ProductExplanation:
        attributes = []
        for attribute_name in important_attributes:
            attribute = all_attributes.attributes[attribute_name]
            value = product[attribute_name]
            if attribute.is_list:
                value = expand_list_value(value)
            position = cls.calculate_attribute_position_non_candidate(
                category_name=category_name,
                attribute=all_attributes.attributes[attribute_name],
                value=product[attribute_name],
                candidates=candidates,
            )
            attributes.append(
                ProductAttributeExplanation(attribute=attribute, attribute_value=value, position=position)
            )
        return ProductExplanation(
            message=cls._generate_explanation_message_non_candidate(
                product=product, candidates=candidates, all_attributes=all_attributes
            ),
            attributes=attributes,
            price_position=cls.calculate_attribute_position_non_candidate(
                category_name=category_name,
                attribute=all_attributes.attributes[AttributeName.PRICE.value],
                value=product[AttributeName.PRICE.value],
                candidates=candidates,
            ),
        )

    @classmethod
    def _get_neutral_explanation(
        cls,
        product: pd.Series,
        all_attributes: CategoryAttributes,
        important_attributes: List[str],
    ) -> ProductExplanation:
        attributes = []
        for attribute_name in important_attributes:
            attribute = all_attributes.attributes[attribute_name]
            value = product[attribute_name]
            if attribute.is_list:
                value = expand_list_value(value)
            attributes.append(
                ProductAttributeExplanation(
                    attribute=attribute, attribute_value=value, position=ProductAttributePosition.NEUTRAL
                )
            )
        return ProductExplanation(
            message=ProductExplanationMessage(code=ProductExplanationMessageCode.NONE),
            attributes=attributes,
            price_position=ProductAttributePosition.NEUTRAL,
        )

    @classmethod
    def explain(
        cls,
        category_name: str,
        product_id: int,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> ProductExplanation:
        candidates = DataLoader.load_products(
            category_name=category_name,
            usecols=[AttributeName.PRICE.value, *important_attributes],
            userows=candidate_ids,
        )
        product = DataLoader.load_product(
            category_name=category_name,
            product_id=product_id,
            usecols=[AttributeName.PRICE.value, *important_attributes],
        )
        all_attributes = DataLoader.load_attributes(category_name=category_name)
        if product_id in candidate_ids:
            return cls._explain_candidate(
                category_name=category_name,
                product=product,
                candidates=candidates,
                all_attributes=all_attributes,
                important_attributes=important_attributes,
            )
        if product_id in discarded_ids:
            return cls._get_neutral_explanation(
                product=product,
                all_attributes=all_attributes,
                important_attributes=important_attributes,
            )
        return cls._explain_non_candidate(
            category_name=category_name,
            product=product,
            candidates=candidates,
            all_attributes=all_attributes,
            important_attributes=important_attributes,
        )
