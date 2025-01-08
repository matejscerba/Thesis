from typing import Dict, Any, List, Tuple, cast

import numpy as np
import pandas as pd


class SetBasedMixin:
    """This class holds implementations of helper functions used by the SetBased recommender model family."""

    @classmethod
    def _prepare_column_mapping(
        cls,
        products: pd.DataFrame,
        important_attributes: List[str],
    ) -> Tuple[Dict[str, Dict[Any, int]], int]:
        """Prepares mapping from (attribute name, value) tuple to index of column in the resulting numpy array.

        :param pd.DataFrame products: dataframe containing the products
        :param List[str] important_attributes: names of the important attributes
        :return: items map
        :rtype: np.ndarray
        """
        column_mapping: Dict[str, Dict[Any, int]] = {}
        num_columns: int = 0
        for attribute in important_attributes:
            values = products[attribute].unique()
            column_mapping[attribute] = {}
            for value in values:
                if pd.isna(value):
                    continue
                column_mapping[attribute][value] = num_columns
                num_columns += 1
        return column_mapping, num_columns

    @classmethod
    def _compute_scores(
        cls,
        products: pd.DataFrame,
        num_columns: int,
        important_attributes: List[str],
        column_mapping: Dict[str, Dict[Any, int]],
        user_model: np.ndarray,
    ) -> np.ndarray:
        """Computes scores based on the user model.

        :param pd.DataFrame products: dataframe containing the products
        :param int num_columns: number of columns of the data
        :param List[str] important_attributes: names of the important attributes
        :param Dict[str, Dict[Any, int]] column_mapping: mapping from (attribute name, value) tuple to index of column
        :param np.ndarray user_model: user preference model
        :return: scores of each product based on the user preference model
        :rtype: np.ndarray
        """
        # Compute item maps for each product, 1 is at the position of (attribute name, value) pair, 0 elsewhere
        items = np.zeros((len(products), num_columns))
        for idx, row in products.iterrows():
            for attribute in important_attributes:
                if pd.isna(row[attribute]):
                    continue
                column_idx = column_mapping[attribute][row[attribute]]
                items[cast(int, idx), column_idx] = 1

        return np.sum(items * user_model, axis=-1)
