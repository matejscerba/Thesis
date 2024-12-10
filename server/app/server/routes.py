from flask import Flask

from app.server.views import (
    view_category,
    view_category_filter,
    view_attributes,
    view_discarded,
    view_explanation,
    view_categories,
    view_stopping_criteria,
    view_log_event,
    view_update_attributes_state,
    view_config,
    view_download_events,
)


def add_routes(app: Flask) -> None:
    """Adds routes to given Flask application.

    :param Flask app: the Flask application to which add the routes
    :return: None
    """
    app.add_url_rule(rule="/config", view_func=view_config, methods=["GET"])
    app.add_url_rule(rule="/categories", view_func=view_categories, methods=["GET"])
    app.add_url_rule(rule="/category", view_func=view_category, methods=["POST"])
    app.add_url_rule(rule="/category/filter", view_func=view_category_filter, methods=["POST"])
    app.add_url_rule(rule="/attributes", view_func=view_attributes, methods=["GET"])
    app.add_url_rule(rule="/discarded", view_func=view_discarded, methods=["POST"])
    app.add_url_rule(rule="/explanation", view_func=view_explanation, methods=["POST"])
    app.add_url_rule(rule="/stopping_criteria", view_func=view_stopping_criteria, methods=["POST"])
    app.add_url_rule(rule="/log_event", view_func=view_log_event, methods=["POST"])
    app.add_url_rule(rule="/update_attributes_state", view_func=view_update_attributes_state, methods=["POST"])
    app.add_url_rule(rule="/download_events", view_func=view_download_events, methods=["GET"])
