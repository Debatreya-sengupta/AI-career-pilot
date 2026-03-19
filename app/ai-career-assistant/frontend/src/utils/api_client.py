from typing import Any, Dict
import requests

class APIClient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    def get(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        response = requests.get(f"{self.base_url}/{endpoint}", params=params)
        response.raise_for_status()
        return response.json()

    def post(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        response = requests.post(f"{self.base_url}/{endpoint}", json=data)
        response.raise_for_status()
        return response.json()

    def upload_file(self, endpoint: str, file_path: str) -> Dict[str, Any]:
        with open(file_path, 'rb') as file:
            response = requests.post(f"{self.base_url}/{endpoint}", files={'file': file})
            response.raise_for_status()
            return response.json()