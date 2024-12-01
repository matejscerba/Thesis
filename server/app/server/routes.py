from flask import Flask

from app.server.views import (
    view_category,
    view_category_filter,
    view_attributes,
    view_discarded,
    view_explanation,
    view_categories,
    view_stopping_criteria,
)


def add_routes(app: Flask) -> None:
    """Adds routes to given Flask application.

    :param Flask app: the Flask application to which add the routes
    :return: None
    """
    app.add_url_rule("/categories", view_func=view_categories, methods=["GET"])
    app.add_url_rule("/category", view_func=view_category, methods=["POST"])
    app.add_url_rule("/category/filter", view_func=view_category_filter, methods=["POST"])
    app.add_url_rule("/attributes", view_func=view_attributes, methods=["GET"])
    app.add_url_rule("/discarded", view_func=view_discarded, methods=["GET"])
    app.add_url_rule("/explanation", view_func=view_explanation, methods=["GET"])
    app.add_url_rule("/stopping_criteria", view_func=view_stopping_criteria, methods=["GET"])
