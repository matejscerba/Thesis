from typing import List, Dict, Any, Set, Optional

import numpy as np
import pandas as pd

from app.data_loader import DataLoader


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
    def explain(
        cls, category_name: str, product_id: int, candidate_ids: List[int], discarded_ids: List[int]
    ) -> Optional[str]:
        return "explanation"
