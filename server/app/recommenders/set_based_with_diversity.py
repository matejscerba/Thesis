import random
from typing import List, ClassVar, Tuple

import pandas as pd

from app.recommenders.abstract import RecommenderModel
from app.recommenders.mixins.set_based_mixin import SetBasedMixin
from app.recommenders.set_based import SetBasedRecommender


class SetBasedRecommenderWithDiversity(SetBasedRecommender, SetBasedMixin):
    """This class implements a simplified version of the recommender system based on
    https://www.researchgate.net/publication/334584513_Transparent_Scrutable_and_Explainable_User_Models_for_Personalized_Recommendation
    with diversification during post-processing

    :param ClassVar[RecommenderModel] model: the model of this recommender system
    """

    model: ClassVar[RecommenderModel] = RecommenderModel.SET_BASED_WITH_DIVERSITY

    @classmethod
    def _compute_max_similarity(cls, item: pd.Series, items: List[pd.Series]) -> float:
        max_similarity = 0.0
        for rhs in items:
            similarity = (item == rhs).mean()
            if similarity > max_similarity:
                max_similarity = similarity
        return max_similarity

    @classmethod
    def _post_process(
        cls,
        items: List[Tuple[int, float]],
        limit: int,
    ) -> List[int]:
        """Post processes items with their scores.

        :param List[Tuple[int, float]] items: items to be post processed (ID, score)
        :param int limit: maximum number of items to be returned
        :return: IDs of the alternative products and their scores
        :rtype: List[Tuple[int, float]]
        """
        result = []

        if len(items) > 0:
            for _ in range(limit):
                # Scores are technically integers stating how many attributes are the same
                # Diversification can be implemented on the scores alone without the understanding of the attributes
                score_options = list(set([item[1] for item in items if item[0] not in result]))
                if len(score_options) == 0:
                    break
                try:
                    current_score = random.choices(
                        population=score_options, weights=[option**2 for option in score_options], k=1
                    )[0]
                except ValueError:
                    # Probably sum(weights) == 0 (all score options are 0), take the first option
                    current_score = score_options[0]
                for item in items:
                    if item[0] in result:
                        # Item is already selected, skip it
                        continue
                    if item[1] == current_score:
                        result.append(item[0])
                        break

        return result
