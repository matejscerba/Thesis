import os
from typing import Type, ClassVar, Optional

from app.explanations.abstract import AbstractExplanations, ExplanationsModel


class ExplanationsSelector:
    """This class selects the implementation of the explanations generator that this app uses.

    :param ClassVar[ExplanationsModel] model: the model set by the environment variable
    :param ClassVar[Optional[Type[AbstractExplanations]]] _generator: current generator
    """

    model: ClassVar[ExplanationsModel] = ExplanationsModel(os.environ["EXPLANATIONS_MODEL"])
    _generator: ClassVar[Optional[Type[AbstractExplanations]]] = None

    @classmethod
    def get_generator(cls) -> Type[AbstractExplanations]:
        """Gets implementation of the currently selected explanations model.

        :return: explanations generator implementation
        :rtype: Type[AbstractExplanations]
        """
        if cls._generator is not None:
            return cls._generator

        generators = AbstractExplanations.__subclasses__()
        for generator in generators:
            if generator.model == cls.model:
                cls._generator = generator
                return generator
        raise Exception(f"{cls.model} explanations implementation not found.")
