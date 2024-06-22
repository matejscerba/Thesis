from flask import Flask
from flask_cors import CORS

from app.server.encoder import json_default
from app.server.routes import add_routes


def create_app() -> Flask:
    app = Flask("Server")
    CORS(app)
    app.config["CORS_HEADERS"] = ["Content-Type", "Access-Control-Allow-Origin"]
    app.json.default = json_default

    add_routes(app=app)

    return app
