from typing import List, Set, ClassVar, Tuple, cast

import numpy as np
import pandas as pd

from app.data_loader import DataLoader
from app.recommenders.abstract import AbstractRecommender, RecommenderModel
from app.recommenders.mixins.set_based_mixin import SetBasedMixin


class SetBasedCandidatesOnlyRecommender(AbstractRecommender, SetBasedMixin):
    """This class implements a simplified version of the recommender system based on
    https://www.researchgate.net/publication/334584513_Transparent_Scrutable_and_Explainable_User_Models_for_Personalized_Recommendation

    Only candidates are considered when building user model.

    :param ClassVar[RecommenderModel] model: the model of this recommender system
    """

    model: ClassVar[RecommenderModel] = RecommenderModel.SET_BASED_CANDIDATES_ONLY

    @classmethod
    def _predict_impl(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> List[Tuple[int, float]]:
        """Scores products and orders all except candidates and discarded by their score, which is returned as well.

        :param str category_name: the name of the category
        :param Set[int] candidate_ids: IDs of the candidate products
        :param Set[int] discarded_ids: IDs of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: IDs of the alternative products and their scores
        :rtype: List[Tuple[int, float]]
        """
        products = DataLoader.load_products(category_name=category_name, usecols=important_attributes)

        column_mapping, num_columns = cls._prepare_column_mapping(
            products=products, important_attributes=important_attributes
        )

        # Compute user model, each candidate supports the preference with `1/len(candidates_ids) at the position of
        # attribute value a candidate has, only important attributes are considered
        user_model = np.zeros(num_columns)
        for _, row in products.iterrows():
            if row["id"] in candidate_ids:
                rating = 1 / len(candidate_ids)
            else:
                continue
            for attribute in important_attributes:
                if pd.isna(row[attribute]):
                    continue
                column_idx = column_mapping[attribute][row[attribute]]
                user_model[column_idx] += rating

        scores = cls._compute_scores(
            products=products,
            num_columns=num_columns,
            important_attributes=important_attributes,
            column_mapping=column_mapping,
            user_model=user_model,
        )
        order = np.argsort(scores)[::-1]

        # Return ordered ids of products, exclude candidates and discarded products
        return [
            (cast(int, id), scores[order[index]].item())
            for index, id in enumerate(products["id"].to_numpy()[order].tolist())
            if id not in candidate_ids and id not in discarded_ids
        ]
