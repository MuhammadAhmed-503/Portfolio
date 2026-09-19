from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class VoiceRequest(BaseModel):
    text: str
    history: Optional[List[Message]] = []

class VoiceResponse(BaseModel):
    is_command: bool
    command: Optional[str] = None
    response: str
    expression: str = "idle"

class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None