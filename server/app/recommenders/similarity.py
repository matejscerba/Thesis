from typing import Dict, Any

import numpy as np

from app.data_loader import DataLoader
from app.recommenders.abstract import AbstractRecommender
from app.users import Users


class SimilarityRecommender(AbstractRecommender):
    @classmethod
    def predict(cls) -> Dict[str, Any]:
        data = DataLoader.load()

        sample_users = Users.load_sample()

        result = {}

        for user, user_data in sample_users.items():
            trimmed_data = data[user_data["attributes"]["important"]]

            trimmed_data = trimmed_data.to_numpy()

            candidates_ids = np.array(user_data["items"]["candidates"])

            candidates = trimmed_data[candidates_ids]
            rest = np.delete(trimmed_data, candidates_ids, axis=0)

            expanded = np.repeat(rest[:, np.newaxis, :], candidates.shape[0], axis=1)

            differences = np.abs(expanded - candidates)

            differences_per_candidate = np.transpose(differences, [0, 2, 1])

            positions_per_attributes = np.apply_along_axis(
                lambda x: np.unique(x, return_inverse=True)[1], -1, differences_per_candidate
            )

            positions_per_candidate = np.sum(positions_per_attributes, axis=1)
            closest_candidates = np.argmin(positions_per_candidate, axis=-1)

            closest_differences = differences[np.arange(differences.shape[0]), closest_candidates]

            rest_positions_per_attributes = np.apply_along_axis(
                lambda x: np.unique(x, return_inverse=True)[1], 0, closest_differences
            )

            rest_positions = np.sum(rest_positions_per_attributes, axis=1)

            positions = np.argsort(rest_positions)

            result[user] = np.delete(data["id"].to_numpy(), candidates_ids)[positions][:10].tolist()

        return result
