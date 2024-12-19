from typing import List, Any

import numpy as np
import pandas as pd

from app.attributes.attribute import CategoryAttributes, AttributeOrder, AttributeType, Attribute
from app.data_loader import DataLoader
from app.products.explanations import (
    ProductExplanation,
    ProductAttributeExplanation,
    ProductAttributePosition,
    ProductExplanationMessage,
    ProductExplanationMessageCode,
)
from app.utils.attributes import expand_list_value, expand_list_values


class ContentBasedMixin:
    """This class holds implementations of helper functions used by the ContentBased explanations model family."""

    @classmethod
    def _calculate_attribute_position_non_candidate(
        cls, category_name: str, attribute: Attribute, value: Any, candidates: pd.DataFrame
    ) -> ProductAttributePosition:
        """Calculates the position of an attribute's value with respect to the candidate products.

        :param str category_name: the name of the category
        :param Attribute attribute: the attribute which position should be analyzed
        :param Any value: the value of the attribute to be analyzed
        :param pd.DataFrame candidates: a dataframe containing the candidate products
        :return: position of an attribute's value with respect to the candidate products
        :rtype: ProductAttributePosition
        """
        if pd.isna(value) or len(candidates) == 0:
            return ProductAttributePosition.NEUTRAL

        all_values = candidates[attribute.full_name].dropna()

        if attribute.type == AttributeType.NUMERICAL and attribute.order is not None:
            # Check whether numerical attribute's value is better or worse than any candidate or relevant (in the range
            # bounded by candidates)
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
            # Check whether categorical attribute's value is among relevant values (defined by candidates)
            if attribute.is_list:
                list_value = expand_list_value(value=value)
                all_values_values = expand_list_values(values=all_values.values.tolist())
                if not pd.isna(value) and len(set(list_value).intersection(set(all_values_values))) > 0:
                    return ProductAttributePosition.RELEVANT
            if value in all_values.values:
                return ProductAttributePosition.RELEVANT

        # Check whether attribute's value is higher or lower rated than all candidates
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
    def _calculate_attribute_position_candidate(
        cls, category_name: str, attribute: Attribute, value: Any, candidates: pd.DataFrame
    ) -> ProductAttributePosition:
        """Calculates the position of an attribute's value with respect to the rest of the candidate products.

        :param str category_name: the name of the category
        :param Attribute attribute: the attribute which position should be analyzed
        :param Any value: the value of the attribute to be analyzed
        :param pd.DataFrame candidates: a dataframe containing the candidate products
        :return: position of an attribute's value with respect to the candidate products
        :rtype: ProductAttributePosition
        """
        if pd.isna(value):
            return ProductAttributePosition.NEUTRAL

        all_values = candidates[attribute.full_name].dropna()
        unique_values = all_values.unique()
        if len(unique_values) <= 1:
            return ProductAttributePosition.NEUTRAL

        if attribute.type == AttributeType.NUMERICAL and attribute.order is not None:
            # Check whether numerical attribute's value is best or worst of all candidates
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

        # Check whether attribute's value is highest or lowest rated of all candidates
        all_ratings = DataLoader.load_ratings(
            category_name=category_name, attribute_name=attribute.full_name, values=all_values
        )
        rating = DataLoader.load_rating(category_name=category_name, attribute_name=attribute.full_name, value=value)
        if rating is not None and all_ratings is not None:
            unique_ratings = all_ratings.dropna().unique()
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
        """Explains candidate product.

        :param str category_name: the name of the category
        :param pd.Series product: a pandas series representing the product to be explained
        :param pd.DataFrame candidates: a dataframe containing the candidate products
        :param CategoryAttributes all_attributes: all attributes of the given category
        :param List[str] important_attributes: names of the important attributes
        :return: explanation of a given product
        :rtype: ProductExplanation
        """
        attributes = []
        for attribute_name in important_attributes:
            # Explain all important attributes
            attribute = all_attributes.attributes[attribute_name]
            value = product[attribute_name]
            if attribute.is_list:
                value = expand_list_value(value=value)
            position = cls._calculate_attribute_position_candidate(
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
        )

    @classmethod
    def _get_message_code_non_candidate(
        cls,
        product: pd.Series,
        candidates: pd.DataFrame,
        all_attributes: CategoryAttributes,
    ) -> ProductExplanationMessageCode:
        """Gets message code for a non-candidate product.

        :param pd.Series product: the product to be inspected
        :param pd.DataFrame candidates: pandas dataframe representing all candidates
        :param CategoryAttributes all_attributes: all attributes of a given category
        :return: product explanation message code representing the product
        :rtype: ProductExplanationMessageCode
        """

        # Find numerical attributes with order of a product and candidates
        numerical_attributes = all_attributes.get_numerical_attributes()
        numerical_columns = [
            col
            for col in candidates.columns
            if col in numerical_attributes and numerical_attributes[col].order is not None
        ]
        if len(numerical_columns) == 0:
            return ProductExplanationMessageCode.NONE

        # Assign map to columns - ascending attributes have value 1, descending -1 so that future comparison can be done
        # in one direction
        columns_map = np.array(
            [
                1 if numerical_attributes[attribute].order == AttributeOrder.ASCENDING else -1
                for attribute in numerical_columns
            ]
        )

        # Compare numerical attributes with order of given product with the best and worst values among candidates.
        numerical_product = product[numerical_columns] * columns_map
        best_candidate = (candidates[numerical_columns] * columns_map).max(axis=0)
        worst_candidate = (candidates[numerical_columns] * columns_map).min(axis=0)

        if (numerical_product > best_candidate).all():
            return ProductExplanationMessageCode.BETTER_THAN_ALL_CANDIDATES

        if (numerical_product < worst_candidate).all():
            return ProductExplanationMessageCode.WORSE_THAN_ALL_CANDIDATES
        return ProductExplanationMessageCode.NONE

    @classmethod
    def _generate_explanation_message_non_candidate(
        cls,
        product: pd.Series,
        candidates: pd.DataFrame,
        all_attributes: CategoryAttributes,
    ) -> ProductExplanationMessage:
        """Generate an explanation message for a non-candidate product.

        :param pd.Series product: product to be explained
        :param pd.DataFrame candidates: dataframe containing all candidates
        :param CategoryAttributes all_attributes: all attributes of a given category
        :return: explanation message for a given product
        :rtype: ProductExplanationMessage
        """
        return ProductExplanationMessage(
            code=cls._get_message_code_non_candidate(
                product=product, candidates=candidates, all_attributes=all_attributes
            )
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
        """Explains non-candidate product.

        :param str category_name: the name of the category
        :param pd.Series product: a pandas series representing the product to be explained
        :param pd.DataFrame candidates: a dataframe containing the candidate products
        :param CategoryAttributes all_attributes: all attributes of the given category
        :param List[str] important_attributes: names of the important attributes
        :return: explanation of a given product
        :rtype: ProductExplanation
        """
        attributes = []
        for attribute_name in important_attributes:
            # Explain all important attributes
            attribute = all_attributes.attributes[attribute_name]
            value = product[attribute_name]
            if attribute.is_list:
                value = expand_list_value(value=value)
            position = cls._calculate_attribute_position_non_candidate(
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
        )

    @classmethod
    def _get_neutral_explanation(
        cls,
        product: pd.Series,
        all_attributes: CategoryAttributes,
        important_attributes: List[str],
    ) -> ProductExplanation:
        """Generates neutral explanation for a given product.

        :param pd.Series product: a pandas series representing the product to be explained
        :param CategoryAttributes all_attributes: all attributes of the given category
        :param List[str] important_attributes: names of the important attributes
        :return: neutral explanation of a given product
        :rtype: ProductExplanation
        """
        attributes = []
        for attribute_name in important_attributes:
            attribute = all_attributes.attributes[attribute_name]
            value = product[attribute_name]
            if attribute.is_list:
                value = expand_list_value(value=value)
            attributes.append(
                ProductAttributeExplanation(
                    attribute=attribute, attribute_value=value, position=ProductAttributePosition.NEUTRAL
                )
            )
        return ProductExplanation(
            message=ProductExplanationMessage(code=ProductExplanationMessageCode.NONE),
            attributes=attributes,
        )
