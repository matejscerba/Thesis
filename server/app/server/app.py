import os

from flask import Flask
from flask_cors import CORS
from flask_session import Session  # type: ignore[attr-defined,import-untyped]

from app.server.encoder import json_default
from app.server.routes import add_routes


def create_app() -> Flask:
    """Creates and configures Flask application.

    :return: Flask application
    :rtype: Flask
    """
    app = Flask("Server")

    # Set up CORS
    app.config["CORS_HEADERS"] = ["Content-Type", "Access-Control-Allow-Origin"]

    # Set up session storage
    session_file_dir = "data/session"
    os.makedirs(session_file_dir, exist_ok=True)
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = session_file_dir
    app.config["SECRET_KEY"] = os.environ["SESSION_SECRET_KEY"]
    app.config["SESSION_COOKIE_SAMESITE"] = "None"
    app.config["SESSION_COOKIE_SECURE"] = True

    # Set up json encoder
    app.json.default = json_default  # type: ignore[attr-defined]

    CORS(app, supports_credentials=True)
    Session(app)

    add_routes(app=app)

    return app
