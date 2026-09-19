from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import voice
from app.routes.websocket import websocket_endpoint

app = FastAPI(
    title="AI Assistant Backend",
    description="Voice-controlled AI assistant for portfolio website",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])

# WebSocket Route
app.add_api_websocket_route("/api/ws", websocket_endpoint)

@app.get("/")
async def root():
    return {
        "message": "AI Assistant Backend is running! 🎙️",
        "status": "active",
        "endpoints": {
            "voice": "/api/voice/process",
            "tts": "/api/voice/tts",
            "websocket": "/api/ws",
            "health": "/api/voice/health"
        }
    }