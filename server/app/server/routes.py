from flask import Flask

from app.server.views import (
    view_healthcheck,
    view_index
)


def add_routes(app: Flask) -> None:
    app.add_url_rule("/", view_func=view_index, methods=["GET"])
    app.add_url_rule("/healthcheck", view_func=view_healthcheck, methods=["GET"])
