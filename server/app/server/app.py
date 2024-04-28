from flask import Flask
from flask_cors import CORS

from app.server.routes import add_routes


def create_app() -> Flask:
    app = Flask("Server")
    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    add_routes(app=app)

    return app
