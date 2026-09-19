from app.services.gemini_service import GeminiService

class LLMService:
    def __init__(self):
        self.gemini = GeminiService()
    
    async def process_message(self, user_text: str, history: list = None):
        return await self.gemini.process_message(user_text, history or [])