CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT NOT NULL,
    app_flow_type TEXT NOT NULL,
    user_study_setup TEXT NULL,
    ui_type TEXT NULL,
    event TEXT NOT NULL,
    state TEXT NOT NULL,
    data TEXT NULL
);
CREATE TABLE IF NOT EXISTS prolific (
    prolific_id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
