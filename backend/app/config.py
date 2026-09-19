from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # Gemini API Key (Free from Google AI Studio)
    gemini_api_key: str
    
    # Server
    port: int = 8000
    debug: bool = True
    
    # CORS - Allow frontend to call backend (allows local network mobile access & production)
    allowed_origins: List[str] = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()