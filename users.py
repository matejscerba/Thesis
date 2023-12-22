import json
from typing import Dict, Any


class Users:
    @classmethod
    def load_sample(cls) -> Dict[str, Any]:
        with open("data/sample_users.json", mode="r") as file:
            return json.load(file)
