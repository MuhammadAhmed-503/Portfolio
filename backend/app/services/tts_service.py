import edge_tts
import re
from typing import Optional


def detect_voice(text: str) -> str:
    """Agar Urdu script (Arabic/Urdu Unicode range) mile to Urdu voice, warna English"""
    urdu_pattern = re.compile(r'[\u0600-\u06FF]')
    if urdu_pattern.search(text):
        return "ur-PK-UzmaNeural"
    return "en-US-AnaNeural"


class TTSService:
    def __init__(self, voice: str = "en-US-AnaNeural"):
        self.voice = voice

    async def generate_speech(self, text: str, voice_id: Optional[str] = None) -> bytes:
        """Generate real speech audio using edge-tts (free, no API key)"""
        try:
            voice = voice_id or detect_voice(text)
            communicate = edge_tts.Communicate(text, voice)
            audio_bytes = b""

            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_bytes += chunk["data"]

            return audio_bytes if audio_bytes else None

        except Exception as e:
            print(f"edge-tts error: {e}")
            return None

    async def stream_speech(self, text: str, voice_id: Optional[str] = None):
        """Generator jo audio chunks milte hi yield karta hai — poora wait nahi karta"""
        try:
            voice = voice_id or detect_voice(text)
            communicate = edge_tts.Communicate(text, voice)
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    yield chunk["data"]
        except Exception as e:
            print(f"edge-tts stream error: {e}")

    async def generate_speech_base64(self, text: str) -> Optional[str]:
        import base64
        audio = await self.generate_speech(text)
        if audio:
            return base64.b64encode(audio).decode('utf-8')
        return None