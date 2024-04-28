from flask import Flask

from app.server.routes import add_routes


def create_app() -> Flask:
    app = Flask("Server")

    add_routes(app=app)

    return app
