from typing import List, Set, Tuple

from pydantic import BaseModel

from app.attributes.attribute import MultiFilterItem


class StoppingCriterionItem(BaseModel):
    """This class represents an individual stopping criteria item.

    :param List[MultiFilterItem] support_set: the support set of filters of this stopping criteria item
    :param List[MultiFilterItem] attribute_value: the attribute value of this stopping criteria item
    :param float num_products: the number of not yet seen products satisfying this stopping criteria item
    :param float metric: the value of the metric
    """

    support_set: List[MultiFilterItem]
    attribute_value: List[MultiFilterItem]
    num_products: int
    metric: float

    @property
    def metric_with_complexity(self) -> Tuple[float, int]:
        """Combines the metric and complexity to be used for sorting.

        :return: metric and inverse complexity, these values are used for sorting
        :rtype: Tuple[float, int]
        """
        return self.metric, -self.complexity  # Smaller complexity ~ better, hence the - sign

    @property
    def attributes(self) -> Set[MultiFilterItem]:
        """Returns the set containing all attributes filters contained in this stopping criteria item.

        :return: all attribute filters used in this stopping criteria item
        :rtype: Set[MultiFilterItem]
        """
        return {*self.support_set, *self.attribute_value}

    @property
    def complexity(self) -> int:
        """Computes the complexity of this stopping criteria item.

        :return: complexity of this stopping criteria item
        :rtype: int
        """
        return len(self.support_set) + len(self.attribute_value)

    @classmethod
    def compute_metric(cls, num_support_candidates: int, num_all_candidates: int, num_all_discarded: int) -> float:
        """Computes the metric based on given numbers of products.

        :param int num_support_candidates: number of candidates satisfying support set of a stopping criteria item
        :param int num_all_candidates: number of candidates satisfying all filters of a stopping criteria item
        :param int num_all_discarded: number of discarded products satisfying all filters of a stopping criteria item
        :return: metric based on given numbers of products
        :rtype: float
        """
        try:
            return (num_all_candidates - num_all_discarded) / num_support_candidates
        except ZeroDivisionError:
            return 0

    def similarity(self, rhs: "StoppingCriterionItem") -> float:
        """Computes a similarity of this and given stopping criteria item.

        :param StoppingCriterionItem rhs: stopping criteria item against which to compute similarity
        :return: similarity if this and given stopping criteria item
        :rtype: float
        """
        return len(self.attributes.intersection(rhs.attributes)) / len(self.attributes.union(rhs.attributes))


class StoppingCriteria(BaseModel):
    """This class represents the stopping criteria.

    :param List[StoppingCriterionItem] items: the individual stopping criteria items
    """

    items: List[StoppingCriterionItem]
