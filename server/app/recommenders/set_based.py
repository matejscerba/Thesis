from typing import List, Dict, Any, Set

import numpy as np
import pandas as pd

from app.attributes.attribute import Attribute, AttributeType, AttributeOrder, AttributeName, CategoryAttributes
from app.data_loader import DataLoader
from app.products.explanations import ProductAttributePosition, ProductExplanation, ProductAttributeExplanation


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
        if pd.isna(value):
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
        else:
            all_ratings = DataLoader.load_ratings(
                category_name=category_name, attribute_name=attribute.full_name, values=all_values
            )
            rating = DataLoader.load_rating(
                category_name=category_name, attribute_name=attribute.full_name, value=value
            )
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
        else:
            all_ratings = DataLoader.load_ratings(
                category_name=category_name, attribute_name=attribute.full_name, values=all_values
            )
            rating = DataLoader.load_rating(
                category_name=category_name, attribute_name=attribute.full_name, value=value
            )
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
            message="explanation",
            attributes=attributes,
            price_position=cls.calculate_attribute_position_candidate(
                category_name=category_name,
                attribute=all_attributes.attributes[AttributeName.PRICE.value],
                value=product[AttributeName.PRICE.value],
                candidates=candidates,
            ),
        )

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
            message="non candidate",
            attributes=attributes,
            price_position=cls.calculate_attribute_position_non_candidate(
                category_name=category_name,
                attribute=all_attributes.attributes[AttributeName.PRICE.value],
                value=product[AttributeName.PRICE.value],
                candidates=candidates,
            ),
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
        return cls._explain_non_candidate(
            category_name=category_name,
            product=product,
            candidates=candidates,
            all_attributes=all_attributes,
            important_attributes=important_attributes,
        )
