import random
from typing import List, Dict, Any

import numpy as np
import pandas as pd

from app.data_loader import DataLoader


class SetBasedRecommender:
    @classmethod
    def predict(
        cls,
        category_name: str,
        candidate_ids: List[int],
        discarded_ids: List[int],
        important_attributes: List[int],
    ) -> List[int]:
        all_attributes = DataLoader.load_attributes(category_name=category_name)
        if len(important_attributes) == 0:
            attrs = list(all_attributes.attributes.keys())
            random.shuffle(attrs)
            important_attributes = [int(key) for key in attrs[: min(5, len(attrs))]]

        important_attributes_str = [
            all_attributes.attributes[attribute_index].full_name for attribute_index in important_attributes
        ]

        data = DataLoader.load_products(category_name=category_name, usecols=important_attributes_str)

        column_mapping: Dict[str, Any] = {}
        columns: List[str] = []
        for attribute in important_attributes_str:
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
            for attribute in important_attributes_str:
                if pd.isna(row[attribute]):
                    continue
                column_idx = column_mapping[attribute][row[attribute]]
                user_model[column_idx] += rating

        if len(candidate_ids) > 0 or len(discarded_ids) > 0:
            user_model = user_model / (len(candidate_ids) + len(discarded_ids))

        ratings = np.zeros((len(data), len(columns)))
        for idx, row in data.iterrows():
            for attribute in important_attributes_str:
                if pd.isna(row[attribute]):
                    continue
                column_idx = column_mapping[attribute][row[attribute]]
                ratings[idx, column_idx] = 1

        scores = np.sum(ratings * user_model, axis=-1)
        order = np.argsort(scores)[::-1]

        return [
            id for id in data["id"].to_numpy()[order].tolist() if id not in candidate_ids and id not in discarded_ids
        ]
