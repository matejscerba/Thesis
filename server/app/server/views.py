from typing import Tuple, Any

import flask

from app.recommenders.statements_simple import StatementsSimpleRecommender


def view_healthcheck() -> Tuple[Any, ...]:
    return "", 200


def view_index() -> Tuple[Any, ...]:
    return flask.jsonify(StatementsSimpleRecommender.predict()), 200


def view_product_list() -> Tuple[Any, ...]:
    category_name = flask.request.args.get("category")
    return category_name, 200
