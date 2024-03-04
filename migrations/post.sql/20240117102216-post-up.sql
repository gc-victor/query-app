CREATE TABLE IF NOT EXISTS post(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE CHECK (uuid != '') DEFAULT (uuid()) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TRIGGER IF NOT EXISTS trigger_post_update
    AFTER UPDATE ON post
    BEGIN
        UPDATE post
        SET updated_at=(strftime('%s', 'now'))
        WHERE id=OLD.id;
    END;
