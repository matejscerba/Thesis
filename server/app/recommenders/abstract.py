from abc import abstractmethod, ABC


class AbstractRecommender(ABC):
    @classmethod
    @abstractmethod
    def predict(cls):
        raise NotImplementedError()
