import os
from typing import Type, ClassVar, Optional

from app.explanations.abstract import AbstractExplanationsGenerator, ExplanationsGeneratorModel
from app.utils.selector import get_all_subclasses


class ExplanationsSelector:
    """This class selects the implementation of the explanations generator that this app uses.

    :param ClassVar[ExplanationsGeneratorModel] model: the model set by the environment variable
    :param ClassVar[Optional[Type[AbstractExplanationsGenerator]]] _generator: current generator
    """

    model: ClassVar[ExplanationsGeneratorModel] = ExplanationsGeneratorModel(os.environ["EXPLANATIONS_MODEL"])
    _generator: ClassVar[Optional[Type[AbstractExplanationsGenerator]]] = None

    @classmethod
    def get_generator(cls) -> Type[AbstractExplanationsGenerator]:
        """Gets implementation of the currently selected explanations model.

        :return: explanations generator implementation
        :rtype: Type[AbstractExplanationsGenerator]
        """
        if cls._generator is not None:
            return cls._generator

        generators = get_all_subclasses(AbstractExplanationsGenerator)
        for generator in generators:
            if generator.model == cls.model:
                cls._generator = generator
                return generator
        raise Exception(f"{cls.model} explanations implementation not found.")
