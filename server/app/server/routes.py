from flask import Flask

from app.server.views import view_category, view_attributes, view_discarded


def add_routes(app: Flask) -> None:
    app.add_url_rule("/category", view_func=view_category, methods=["POST"])
    app.add_url_rule("/attributes", view_func=view_attributes, methods=["POST"])
    app.add_url_rule("/discarded", view_func=view_discarded, methods=["POST"])
