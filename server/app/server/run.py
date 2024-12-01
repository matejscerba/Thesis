import os

from app.event_logger import EventLogger
from app.server.app import create_app


def run_server() -> None:
    """Creates and runs the Flask app.
    :return: None
    """
    host = os.environ.get("SERVER_HOST", "0.0.0.0")
    port = int(os.environ.get("SERVER_PORT", 8086))
    debug = os.environ.get("SERVER_DEBUG", "False").upper() == "TRUE"

    app = create_app()
    EventLogger().setup()
    app.run(host=host, port=port, debug=debug, load_dotenv=False)
