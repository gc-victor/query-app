CREATE TABLE IF NOT EXISTS token(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE CHECK (uuid != '') DEFAULT (uuid()) NOT NULL,
    active BOOLEAN NOT NULL,
    name TEXT NOT NULL,
    public_token TEXT UNIQUE CHECK (public_token != '') DEFAULT (uuid()) NOT NULL,
    query_token TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TRIGGER IF NOT EXISTS trigger_token_update 
    AFTER UPDATE ON token
    BEGIN
        UPDATE token
        SET updated_at=(strftime('%s', 'now'))
        WHERE id=OLD.id;
    END;