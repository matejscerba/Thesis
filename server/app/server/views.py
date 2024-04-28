from typing import Tuple, Any

from app.recommenders.statements_simple import StatementsSimpleRecommender


def view_healthcheck() -> Tuple[Any, ...]:
    return "", 200


def view_index() -> Tuple[Any, ...]:
    return StatementsSimpleRecommender.predict(), 200
