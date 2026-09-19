from fastapi import APIRouter, HTTPException
from fastapi.responses import Response, StreamingResponse
from app.models.schemas import VoiceRequest, VoiceResponse, TTSRequest
from app.services.llm_service import LLMService
from app.services.tts_service import TTSService

router = APIRouter()
llm_service = LLMService()
tts_service = TTSService()

@router.post("/process", response_model=VoiceResponse)
async def process_voice(request: VoiceRequest):
    """Process voice input and return AI response"""
    try:
        result = await llm_service.process_message(
            request.text,
            request.history or []
        )
        
        return VoiceResponse(
            is_command=result["is_command"],
            command=result.get("command"),
            response=result["response"],
            expression=result.get("expression", "idle")
        )
        
    except Exception as e:
        print(f"Voice processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tts")
async def generate_tts(request: TTSRequest):
    """Generate TTS audio with streaming (faster perceived response)"""
    try:
        return StreamingResponse(
            tts_service.stream_speech(request.text),
            media_type="audio/mpeg"
        )
    except Exception as e:
        print(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Assistant Backend"}