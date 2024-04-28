import os

from app.server.app import create_app


def run_server() -> None:
    host = os.environ["SERVER_HOST"]
    port = int(os.environ["SERVER_PORT"])
    debug = os.environ.get("SERVER_DEBUG", "False").upper() == "TRUE"

    app = create_app()
    app.run(host=host, port=port, debug=debug, load_dotenv=False)
