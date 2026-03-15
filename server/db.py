# SQLite database setup for Bombs and Castles
import sqlite3

DB_PATH = 'bombs_and_castles.db'

def get_connection():
    return sqlite3.connect(DB_PATH)

# Create tables if not exist
with get_connection() as conn:
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS game_sessions (
            session_id TEXT PRIMARY KEY,
            state TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS players (
            player_id TEXT PRIMARY KEY,
            session_id TEXT,
            units TEXT,
            buildings TEXT,
            FOREIGN KEY(session_id) REFERENCES game_sessions(session_id)
        )
    ''')
    conn.commit()
