from fastapi import WebSocket, WebSocketDisconnect
from typing import List
import json
from app.services.llm_service import LLMService

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

manager = ConnectionManager()
llm_service = LLMService()

async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time voice chat"""
    await manager.connect(websocket)
    
    conversation_history = []
    
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message_data = json.loads(data)
                user_text = message_data.get("text", "")
                
                result = await llm_service.process_message(
                    user_text,
                    conversation_history
                )
                
                # Add to history
                conversation_history.append({"role": "user", "content": user_text})
                conversation_history.append({"role": "assistant", "content": result["response"]})
                
                if len(conversation_history) > 20:
                    conversation_history = conversation_history[-20:]
                
                await websocket.send_json({
                    "is_command": result["is_command"],
                    "command": result.get("command"),
                    "response": result["response"],
                    "expression": result.get("expression", "idle")
                })
                
            except json.JSONDecodeError:
                await websocket.send_json({
                    "response": "Sorry, I didn't understand that format 😅",
                    "expression": "annoyed"
                })
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)