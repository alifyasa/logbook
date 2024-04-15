DROP TABLE IF EXISTS log_entries;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    passwordHash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS log_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entryTimestamp TEXT NOT NULL,
    entryMessage TEXT NOT NULL,
    username TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
);
