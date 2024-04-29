from typing import Dict, Any, ClassVar, Set

from app.data_loader import DataLoader
from app.recommenders.abstract import AbstractRecommender
from app.users import Users


class StatementsSimpleRecommender(AbstractRecommender):
    smoothing: ClassVar[float] = 0.1

    @classmethod
    def predict(cls) -> Dict[str, Any]:
        df = DataLoader.load()

        sample_users = Users.load_sample()

        result = {}

        ids_for_value = DataLoader.get_ids_for_value(data=df)

        data = df.to_numpy()

        num_items = data.shape[0]

        for user, user_data in sample_users.items():
            important_set = set(user_data["attributes"]["important"])
            candidates_set = set(user_data["items"]["candidates"])
            discarded_set: Set[str] = set()  # TODO: Add discarded ids

            weights: Dict[str, Dict[float, float]] = {}
            for attribute_name, attribute_ids in ids_for_value.items():
                if attribute_name not in important_set:
                    continue
                weights[attribute_name] = {}
                for value, value_ids in attribute_ids.items():
                    value_candidates = value_ids.intersection(candidates_set)
                    value_discarded = value_ids.intersection(discarded_set)
                    weights[attribute_name][value] = (len(value_candidates) - len(value_discarded)) / (
                        len(value_candidates) + len(value_discarded) + 1
                    )

            prob_values: Dict[int, Dict[str, Dict[float, float]]] = {}
            for item_id in df["id"]:
                if item_id in candidates_set.union(discarded_set):
                    continue

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
                if item_id in candidates_set.union(discarded_set):
                    continue

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
