from typing import List, Set, ClassVar

from app.attributes.attribute import AttributeName
from app.data_loader import DataLoader
from app.explanations.abstract import AbstractExplanationsGenerator, ExplanationsGeneratorModel
from app.explanations.mixins.content_based import ContentBasedMixin
from app.products.explanations import ProductExplanation


class ContentBasedNeutralExplanations(AbstractExplanationsGenerator, ContentBasedMixin):
    """This class holds the implementation of a neutral content based explanations generator.

    :param ClassVar[ExplanationsModel] model: the model of this explanations generator
    """

    model: ClassVar[ExplanationsGeneratorModel] = ExplanationsGeneratorModel.NEUTRAL

    @classmethod
    def explain(
        cls,
        category_name: str,
        product_id: int,
        candidate_ids: Set[int],
        discarded_ids: Set[int],
        important_attributes: List[str],
    ) -> ProductExplanation:
        """Explains the given product and its attributes.

        Generates neutral explanation for any product and all important attributes.

        :param str category_name:
        :param int product_id:
        :param Set[int] candidate_ids: IDs of the candidate products
        :param Set[int] discarded_ids: IDs of the discarded products
        :param List[str] important_attributes: names of the important attributes
        :return: explanation of a given product
        :rtype: ProductExplanation
        """
        product = DataLoader.load_product(
            category_name=category_name,
            product_id=product_id,
            usecols=[AttributeName.PRICE.value, *important_attributes],
        )
        all_attributes = DataLoader.load_attributes(category_name=category_name)

        return cls._get_neutral_explanation(
            product=product,
            all_attributes=all_attributes,
            important_attributes=important_attributes,
        )
