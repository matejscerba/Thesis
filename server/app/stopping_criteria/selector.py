import os
from typing import Type, ClassVar, Optional

from app.stopping_criteria.abstract import StoppingCriteriaModel, AbstractStoppingCriteria


class StoppingCriteriaSelector:
    model: ClassVar[StoppingCriteriaModel] = StoppingCriteriaModel(os.environ["STOPPING_CRITERIA_MODEL"])
    _generator: ClassVar[Optional[Type[AbstractStoppingCriteria]]] = None

    @classmethod
    def get_generator(cls) -> Type[AbstractStoppingCriteria]:
        if cls._generator is not None:
            return cls._generator

        generators = AbstractStoppingCriteria.__subclasses__()
        for generator in generators:
            if generator.model == cls.model:
                cls._generator = generator
                return generator
        raise Exception(f"{cls.model} stopping criteria implementation not found.")
