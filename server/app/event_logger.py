import json
import os
import sqlite3
import uuid
from enum import Enum
from sqlite3 import Connection
from typing import ClassVar

from app.server.context import context


class Event(str, Enum):
    ALTERNATIVE_ADDED_TO_CANDIDATES = "ALTERNATIVE_ADDED_TO_CANDIDATES"
    ALTERNATIVE_DISCARDED = "ALTERNATIVE_DISCARDED"
    FILTERED_PRODUCT_ADDED_TO_CANDIDATES = "FILTERED_PRODUCT_ADDED_TO_CANDIDATES"
    FILTERED_PRODUCT_DISCARDED = "FILTERED_PRODUCT_DISCARDED"
    DISCARDED_ADDED_TO_CANDIDATES = "DISCARDED_ADDED_TO_CANDIDATES"
    CANDIDATE_DISCARDED = "CANDIDATE_DISCARDED"


class EventLogger:
    SQLITE_DIR_PATH: ClassVar[str] = "data/sqlite"
    DB_NAME: ClassVar[str] = "event_logger.db"

    def get_connection(self) -> Connection:
        os.makedirs(self.SQLITE_DIR_PATH, exist_ok=True)
        return sqlite3.connect(os.path.join(self.SQLITE_DIR_PATH, self.DB_NAME))

    def setup(self) -> None:
        with self.get_connection() as connection:
            cursor = connection.cursor()
            cursor.execute(
                """
                    CREATE TABLE IF NOT EXISTS events (
                        id TEXT PRIMARY KEY NOT NULL,
                        session_id TEXT NOT NULL,
                        user_study_setup TEXT NULL,
                        ui_type TEXT NOT NULL,
                        event TEXT NOT NULL,
                        active_filter TEXT NULL,
                        state TEXT NOT NULL
                    )
                """
            )

    def log(self, event: Event) -> None:
        with self.get_connection() as connection:
            cursor = connection.cursor()
            cursor.execute(
                """
                    INSERT INTO events (
                        id,
                        session_id,
                        user_study_setup,
                        ui_type,
                        event,
                        active_filter,
                        state
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    uuid.uuid4(),
                    context.session_id,
                    json.dumps(context.app_flow.setup.model_dump()) if context.app_flow.setup is not None else None,
                    context.ui_type,
                    event,
                    json.dumps([item.model_dump() for item in context.filter]) if context.filter is not None else None,
                    json.dumps(context.state),
                ),
            )
