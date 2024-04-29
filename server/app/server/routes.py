from flask import Flask

from app.server.views import view_category


def add_routes(app: Flask) -> None:
    app.add_url_rule("/category", view_func=view_category, methods=["POST"])
