# Game logic placeholder for backend
from typing import List, Dict

class Player:
    def __init__(self, player_id: str):
        self.player_id = player_id
        self.units = []
        self.buildings = []

class GameSession:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.players: List[Player] = []
        self.state: Dict = {}

    def add_player(self, player: Player):
        self.players.append(player)

    def get_state(self):
        return self.state

# בעתיד: ניהול משחקים, עדכון מצב, תקשורת עם צד לקוח
