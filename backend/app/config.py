from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json

class Settings(BaseSettings):
    # Gemini API Key (Free from Google AI Studio)
    gemini_api_key: str
    
    # Server
    port: int = 8000
    debug: bool = True
    
    # CORS - Allow frontend to call backend (allows local network mobile access & production)
    allowed_origins: Union[List[str], str] = ["*"]

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return ["*"]
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            # Split comma-separated values (e.g. "*,https://foo.com" or just "*")
            return [item.strip() for item in v.split(",") if item.strip()]
        return ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"

settings = Settings()