from typing import Dict, Any, ClassVar, Set

import numpy as np

from data_loader import DataLoader
from recommenders.abstract import AbstractRecommender
from users import Users


class StatementsDoubleRecommender(AbstractRecommender):
    smoothing: ClassVar[float] = 0.1

    @classmethod
    def predict(cls) -> Dict[str, Any]:
        df = DataLoader.load()

        sample_users = Users.load_sample()

        result = {}

        ids_for_value = DataLoader.get_ids_for_value_compact(data=df)

        data = df.to_numpy()

        num_items = data.shape[0]

        for user, user_data in sample_users.items():
            important_set = set(user_data["attributes"]["important"])
            candidates_set = set(user_data["items"]["candidates"])
            discarded_set = set()  # TODO: Add discarded ids

            weights: Dict[str, Dict[str, float]] = {}
            for i in range(len(ids_for_value.keys())):
                key_i = list(ids_for_value.keys())[i]
                if ":".join(key_i.split(":")[:-1]) not in important_set:
                    continue

                weights[key_i] = {}
                for j in range(i + 1, len(ids_for_value.keys())):
                    key_j = list(ids_for_value.keys())[j]
                    if ":".join(key_j.split(":")[:-1]) not in important_set:
                        continue

                    key_i_ids = ids_for_value[key_i]
                    key_j_ids = ids_for_value[key_j]
                    both_ids = key_i_ids.intersection(key_j_ids)

                    key_i_candidates = key_i_ids.intersection(candidates_set)
                    both_candidates = both_ids.intersection(candidates_set)

                    key_i_discarded = key_i_ids.intersection(discarded_set)
                    both_discarded = both_ids.intersection(discarded_set)

                    w_i = (len(key_i_candidates) - len(key_i_discarded)) / (
                        len(key_i_candidates) + len(key_i_discarded) + 1
                    )
                    weights[key_i][key_j] = (len(both_candidates) - len(both_discarded)) / (
                        len(both_candidates) + len(both_discarded) + 1
                    ) - w_i

            prob_values: Dict[int, Dict[str, Dict[str, float]]] = {}
            for item_id in df["id"]:
                prob_values[item_id] = {}
                for attribute_name, attribute_ids in ids_for_value.items():
                    if attribute_name not in important_set:
                        continue
                    prob_values[item_id][attribute_name] = {}
                    for value, value_ids in attribute_ids.items():
                        w_t_i = 1 if item_id in value_ids else 0
                        prob_values[item_id][attribute_name][value] = (
                            w_t_i + cls.smoothing * len(value_ids) / num_items
                        ) / (cls.smoothing + num_items / len(value_ids))

            weights_plus: Dict[str, Dict[float, float]] = {}
            weights_minus: Dict[str, Dict[float, float]] = {}
            for attribute_name, attribute_ids in ids_for_value.items():
                if attribute_name not in important_set:
                    continue
                weights_plus[attribute_name] = {}
                weights_minus[attribute_name] = {}
                for value, value_ids in attribute_ids.items():
                    if weights[attribute_name][value] > 0:
                        weights_plus[attribute_name][value] = weights[attribute_name][value]
                    else:
                        weights_plus[attribute_name][value] = 0
                    if weights[attribute_name][value] < 0:
                        weights_minus[attribute_name][value] = -weights[attribute_name][value]
                    else:
                        weights_minus[attribute_name][value] = 0

            scores: Dict[int, float] = {}
            for item_id in df["id"]:
                scores[item_id] = 0
                for attribute_name, attribute_weights in weights_plus.items():
                    for value in attribute_weights.keys():
                        scores[item_id] += (
                            weights_plus[attribute_name][value] * prob_values[item_id][attribute_name][value]
                        )
                        scores[item_id] -= (
                            weights_minus[attribute_name][value] * prob_values[item_id][attribute_name][value]
                        )

            ordered = sorted(scores.items(), key=lambda item: item[1], reverse=True)

            result[user] = [item[0] for item in ordered][:10]

        return result
