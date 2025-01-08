import json
import os
import psycopg2
import uuid
from enum import Enum
from typing import Optional, Dict, Any

from psycopg2._psycopg import connection

from app.server.context import context


class Event(str, Enum):
    """This enum represents a type of event."""

    ATTRIBUTE_ADDED_TO_IMPORTANT = "ATTRIBUTE_ADDED_TO_IMPORTANT"
    ATTRIBUTE_REMOVED_FROM_IMPORTANT = "ATTRIBUTE_REMOVED_FROM_IMPORTANT"
    UNSEEN_STATISTIC_OPENED = "UNSEEN_STATISTIC_OPENED"
    STOPPING_CRITERION_OPENED = "STOPPING_CRITERION_OPENED"
    ALTERNATIVE_FINAL_CHOICE_SELECTED = "ALTERNATIVE_FINAL_CHOICE_SELECTED"
    ALTERNATIVE_FINAL_CHOICE_CONFIRMED = "ALTERNATIVE_FINAL_CHOICE_CONFIRMED"
    ALTERNATIVE_ADDED_TO_CANDIDATES = "ALTERNATIVE_ADDED_TO_CANDIDATES"
    ALTERNATIVE_DISCARDED = "ALTERNATIVE_DISCARDED"
    FILTERED_FINAL_CHOICE_SELECTED = "FILTERED_FINAL_CHOICE_SELECTED"
    FILTERED_FINAL_CHOICE_CONFIRMED = "FILTERED_FINAL_CHOICE_CONFIRMED"
    FILTERED_PRODUCT_ADDED_TO_CANDIDATES = "FILTERED_PRODUCT_ADDED_TO_CANDIDATES"
    FILTERED_PRODUCT_DISCARDED = "FILTERED_PRODUCT_DISCARDED"
    DISCARDED_FINAL_CHOICE_SELECTED = "DISCARDED_FINAL_CHOICE_SELECTED"
    DISCARDED_FINAL_CHOICE_CONFIRMED = "DISCARDED_FINAL_CHOICE_CONFIRMED"
    DISCARDED_ADDED_TO_CANDIDATES = "DISCARDED_ADDED_TO_CANDIDATES"
    CANDIDATE_FINAL_CHOICE_SELECTED = "CANDIDATE_FINAL_CHOICE_SELECTED"
    CANDIDATE_FINAL_CHOICE_CONFIRMED = "CANDIDATE_FINAL_CHOICE_CONFIRMED"
    CANDIDATE_DISCARDED = "CANDIDATE_DISCARDED"
    INITIAL_QUESTIONNAIRE_SUBMITTED = "INITIAL_QUESTIONNAIRE_SUBMITTED"
    STEP_QUESTIONNAIRE_SUBMITTED = "STEP_QUESTIONNAIRE_SUBMITTED"
    OVERALL_QUESTIONNAIRE_SUBMITTED = "OVERALL_QUESTIONNAIRE_SUBMITTED"


class EventLogger:
    """This class handles the logging of events into a DB."""

    def get_connection(self) -> connection:
        """Gets a DB connection.

        :return: DB connection
        :rtype: connection
        """
        return psycopg2.connect(
            dbname=os.environ["DB_NAME"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASSWORD"],
            host=os.environ["DB_HOST"],
            port=os.environ["DB_PORT"],
        )

    def log(self, event: Event, data: Optional[Dict[str, Any]]) -> None:
        """Logs a given event to the storage.

        :param Event event: event to be logged
        :param Optional[Dict[str, Any]] data: the data to be logged with the event
        """
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
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
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

    def set_prolific_id(self, prolific_id: str) -> None:
        """Sets a prolific ID in the DB to the current session.

        :param str prolific_id: ID to be stored to the DB
        """
        try:
            with self.get_connection() as connection:
                cursor = connection.cursor()
                cursor.execute(
                    """
                        INSERT INTO prolific (
                            prolific_id,
                            session_id
                        )
                        VALUES (%s, %s)
                    """,
                    (
                        prolific_id,
                        context.session_id,
                    ),
                )
        except psycopg2.errors.UniqueViolation:
            with self.get_connection() as connection:
                cursor = connection.cursor()
                cursor.execute(
                    """
                        SELECT * FROM prolific WHERE session_id=%s and prolific_id=%s
                    """,
                    (context.session_id, prolific_id),
                )
                if len(cursor.fetchall()) == 0:
                    raise Exception("Overwriting Prolific ID of a different session")

    def check_prolific_id(self) -> bool:
        """Checks whether the current session has a prolific ID set.

        :return: whether the current session has a prolific ID in the DB
        :rtype: bool
        """
        with self.get_connection() as connection:
            cursor = connection.cursor()
            cursor.execute(
                """
                    SELECT * FROM prolific WHERE session_id=%s
                """,
                (context.session_id,),
            )
            return len(cursor.fetchall()) > 0
