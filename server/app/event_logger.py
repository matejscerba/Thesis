import json
import os
import sqlite3
import uuid
from enum import Enum
from sqlite3 import Connection
from typing import ClassVar, Optional, Dict, Any

from app.server.context import context


class Event(str, Enum):
    ATTRIBUTE_ADDED_TO_IMPORTANT = "ATTRIBUTE_ADDED_TO_IMPORTANT"
    ATTRIBUTE_REMOVED_FROM_IMPORTANT = "ATTRIBUTE_REMOVED_FROM_IMPORTANT"
    UNSEEN_STATISTIC_OPENED = "UNSEEN_STATISTIC_OPENED"
    STOPPING_CRITERION_OPENED = "STOPPING_CRITERION_OPENED"
    ALTERNATIVE_FINAL_CHOICE_SELECTED = "ALTERNATIVE_FINAL_CHOICE_SELECTED"
    ALTERNATIVE_ADDED_TO_CANDIDATES = "ALTERNATIVE_ADDED_TO_CANDIDATES"
    ALTERNATIVE_DISCARDED = "ALTERNATIVE_DISCARDED"
    FILTERED_FINAL_CHOICE_SELECTED = "FILTERED_FINAL_CHOICE_SELECTED"
    FILTERED_PRODUCT_ADDED_TO_CANDIDATES = "FILTERED_PRODUCT_ADDED_TO_CANDIDATES"
    FILTERED_PRODUCT_DISCARDED = "FILTERED_PRODUCT_DISCARDED"
    DISCARDED_FINAL_CHOICE_SELECTED = "DISCARDED_FINAL_CHOICE_SELECTED"
    DISCARDED_ADDED_TO_CANDIDATES = "DISCARDED_ADDED_TO_CANDIDATES"
    CANDIDATE_FINAL_CHOICE_SELECTED = "CANDIDATE_FINAL_CHOICE_SELECTED"
    CANDIDATE_DISCARDED = "CANDIDATE_DISCARDED"
    INITIAL_QUESTIONNAIRE_SUBMITTED = "INITIAL_QUESTIONNAIRE_SUBMITTED"
    STEP_QUESTIONNAIRE_SUBMITTED = "STEP_QUESTIONNAIRE_SUBMITTED"
    OVERALL_QUESTIONNAIRE_SUBMITTED = "OVERALL_QUESTIONNAIRE_SUBMITTED"


class EventLogger:
    SQLITE_DIR_PATH: ClassVar[str] = "data/sqlite"
    DB_FILENAME: ClassVar[str] = "event_logger.db"

    def get_connection(self) -> Connection:
        os.makedirs(self.SQLITE_DIR_PATH, exist_ok=True)
        return sqlite3.connect(os.path.join(self.SQLITE_DIR_PATH, self.DB_FILENAME))

    def setup(self) -> None:
        with self.get_connection() as connection:
            cursor = connection.cursor()
            cursor.execute(
                """
                    CREATE TABLE IF NOT EXISTS events (
                        id TEXT PRIMARY KEY NOT NULL,
                        created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        session_id TEXT NOT NULL,
                        app_flow_type TEXT NOT NULL,
                        user_study_setup TEXT NULL,
                        ui_type TEXT NULL,
                        event TEXT NOT NULL,
                        state TEXT NOT NULL,
                        data TEXT NULL
                    )
                """
            )

    def log(self, event: Event, data: Optional[Dict[str, Any]]) -> None:
        with self.get_connection() as connection:
            cursor = connection.cursor()
            cursor.execute(
                """
                    INSERT INTO events (
                        id,
                        session_id,
                        app_flow_type,
                        user_study_setup,
                        ui_type,
                        event,
                        state,
                        data
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    str(uuid.uuid4()),
                    context.session_id,
                    context.app_flow.type,
                    json.dumps(context.app_flow.setup.model_dump()) if context.app_flow.setup is not None else None,
                    context.ui_type,
                    event,
                    json.dumps(context.state),
                    json.dumps(data) if data is not None else None,
                ),
            )
