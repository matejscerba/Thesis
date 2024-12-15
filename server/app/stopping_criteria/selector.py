import os
from typing import Type, ClassVar, Optional

from app.stopping_criteria.abstract import StoppingCriteriaGeneratorModel, AbstractStoppingCriteriaGenerator
from app.utils.selector import get_all_subclasses


class StoppingCriteriaSelector:
    """This class selects the implementation of the stopping criteria generator that this app uses.

    :param ClassVar[StoppingCriteriaGeneratorModel] model: the model set by the environment variable
    :param ClassVar[Optional[Type[AbstractStoppingCriteriaGenerator]]] _generator: current generator
    """

    model: ClassVar[StoppingCriteriaGeneratorModel] = StoppingCriteriaGeneratorModel(
        os.environ["STOPPING_CRITERIA_MODEL"]
    )
    _generator: ClassVar[Optional[Type[AbstractStoppingCriteriaGenerator]]] = None

    @classmethod
    def get_generator(cls) -> Type[AbstractStoppingCriteriaGenerator]:
        """Gets implementation of the currently selected stopping criteria model.

        :return: stopping criteria generator implementation
        :rtype: Type[AbstractStoppingCriteriaGenerator]
        """
        if cls._generator is not None:
            return cls._generator

        generators = get_all_subclasses(AbstractStoppingCriteriaGenerator)
        for generator in generators:
            if generator.model == cls.model:
                cls._generator = generator
                return generator
        raise Exception(f"{cls.model} stopping criteria implementation not found.")
