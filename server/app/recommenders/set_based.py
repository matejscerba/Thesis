from typing import List, Set, ClassVar

import numpy as np
import pandas as pd

from app.data_loader import DataLoader
from app.recommenders.abstract import AbstractRecommender, RecommenderModel
from app.recommenders.mixins.set_based_mixin import SetBasedMixin


class SetBasedRecommender(AbstractRecommender, SetBasedMixin):
    """This class implements a simplified version of the recommender system based on
    https://www.researchgate.net/publication/334584513_Transparent_Scrutable_and_Explainable_User_Models_for_Personalized_Recommendation

    :param ClassVar[RecommenderModel] model: the model of this recommender system
    """

    model: ClassVar[RecommenderModel] = RecommenderModel.SET_BASED

    @classmethod
    def predict(
        cls,
        category_name: str,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> List[int]:
        """Predicts alternative products based on candidates and discarded products.

        :param str category_name:
        :param Set[int] candidate_ids: ids of the candidate products
        :param Set[int] discarded_ids: ids of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: ids of the alternative products
        :rtype: List[int]
        """
        products = DataLoader.load_products(category_name=category_name, usecols=important_attributes)

        column_mapping, num_columns = cls._prepare_column_mapping(
            products=products, important_attributes=important_attributes
        )

        # Compute user model, each candidate supports the preference with `1/len(candidates_ids)` at the position of
        # attribute value a candidate has, discarded deducts `1/len(discarded_ids)` from the user model, only important
        # attributes are considered
        user_model = np.zeros(num_columns)
        for _, row in products.iterrows():
            if row["id"] in candidate_ids:
                rating = 1 / len(candidate_ids)
            elif row["id"] in discarded_ids:
                rating = -1 / len(discarded_ids)
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
            id
            for id in products["id"].to_numpy()[order].tolist()
            if id not in candidate_ids and id not in discarded_ids
        ]
