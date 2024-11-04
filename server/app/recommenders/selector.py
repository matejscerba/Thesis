import os
from typing import Type, ClassVar, Optional

from app.recommenders.abstract import AbstractRecommender, RecommenderModel
from app.utils.selector import get_all_subclasses


class RecommenderSelector:
    """This class selects the implementation of the recommender system that this app uses.

    :param ClassVar[RecommenderModel] model: the model set by the environment variable
    :param ClassVar[Optional[Type[AbstractRecommender]]] _recommender: current recommender
    """

    model: ClassVar[RecommenderModel] = RecommenderModel(os.environ["RECOMMENDER_MODEL"])
    _recommender: ClassVar[Optional[Type[AbstractRecommender]]] = None

    @classmethod
    def get_recommender(cls) -> Type[AbstractRecommender]:
        """Gets implementation of the currently selected recommender model.

        :return: recommender implementation
        :rtype: Type[AbstractRecommender]
        """
        if cls._recommender is not None:
            return cls._recommender

        recommenders = get_all_subclasses(AbstractRecommender)
        for recommender in recommenders:
            if recommender.model == cls.model:
                cls._recommender = recommender
                return recommender
        raise Exception(f"{cls.model} recommender implementation not found.")
