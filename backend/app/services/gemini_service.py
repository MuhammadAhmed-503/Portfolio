import json
import re
import asyncio
from typing import List, Dict, Any
import google.generativeai as genai
from app.config import settings
from app.services.command_parser import CommandParser

COLOR_MAP = {
    "purple": "#9c27b0",
    "violet": "#8a2be2",
    "green": "#00e676",
    "emerald": "#00e676",
    "blue": "#2196f3",
    "cyan": "#00e5ff",
    "teal": "#00bfa5",
    "red": "#ff1744",
    "crimson": "#ee0033",
    "pink": "#ff4081",
    "magenta": "#e91e63",
    "orange": "#ff6d00",
    "yellow": "#ffd600",
    "gold": "#ffb300"
}


class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)

        # Structured output schema — Gemini guaranteed valid JSON dega isi shape mein
        response_schema = {
            "type": "object",
            "properties": {
                "response": {"type": "string"},
                "expression": {
                    "type": "string",
                    "enum": ["idle", "happy", "surprised", "thinking", "laughing", "annoyed"]
                },
                "action": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "none",
                                "update_site",
                                "update_theme_colors",
                                "update_hero",
                                "update_about",
                                "add_skill",
                                "remove_skill",
                                "add_project",
                                "remove_project",
                                "update_education",
                                "update_services",
                                "update_certificates",
                                "update_contact",
                                "update_social",
                                "update_background_animation",
                                "scroll_section"
                            ]
                        },
                        "payload": {
                            "type": "object",
                            "properties": {
                                "logo": {"type": "string"},
                                "siteTitle": {"type": "string"},
                                "copyright": {"type": "string"},
                                "primaryColor": {"type": "string"},
                                "bgColor": {"type": "string"},
                                "textColor": {"type": "string"},
                                "firstName": {"type": "string"},
                                "lastName": {"type": "string"},
                                "typingWords": {"type": "array", "items": {"type": "string"}},
                                "image": {"type": "string"},
                                "heading": {"type": "string"},
                                "description": {"type": "string"},
                                "skillName": {"type": "string"},
                                "skillIcon": {"type": "string"},
                                "title": {"type": "string"},
                                "projectDescription": {"type": "string"},
                                "animationName": {"type": "string"},
                                "whatsapp": {"type": "string"},
                                "instagram": {"type": "string"},
                                "github": {"type": "string"},
                                "linkedin": {"type": "string"},
                                "year": {"type": "string"},
                                "issuer": {"type": "string"},
                                "section": {"type": "string"}
                            }
                        }
                    }
                }
            },
            "required": ["response", "expression"]
        }

        self.model = genai.GenerativeModel(
            model_name="gemini-3.5-flash-lite",
            generation_config={
                "temperature": 0.7,
                "max_output_tokens": 800,
                "response_mime_type": "application/json",
                "response_schema": response_schema,
            }
        )
        self.command_parser = CommandParser()

    def _infer_expression_from_emoji(self, text: str) -> str:
        """Fallback: agar response mein specific emoji ho, expression usse infer karein"""
        emoji_expression_map = {
            "😊": "happy", "😄": "happy", "🌟": "happy", "✨": "happy",
            "😂": "laughing", "🤣": "laughing",
            "😢": "annoyed", "😭": "annoyed",
            "🤔": "thinking",
            "😮": "surprised", "😲": "surprised",
        }
        for emoji, expr in emoji_expression_map.items():
            if emoji in text:
                return expr
        return None

    # ===== Fallback for theme/background/color commands =====
    def _handle_theme_command(self, user_text: str):
        user_lower = user_text.lower()
        
        # 1. Direct Theme toggle (dark/light/night/day/mod/mode)
        if any(tw in user_lower for tw in ["dark", "light", "night", "day", "theme", "mode", "mod"]):
            if any(dw in user_lower for dw in ["dark", "night", "andhera", "raat"]):
                return {
                    "is_command": True,
                    "command": "toggle_dark_mode",
                    "action": {"type": "toggle_dark_mode", "payload": {"mode": "dark"}},
                    "response": "Dark mode activated! 🌙",
                    "expression": "happy"
                }
            elif any(lw in user_lower for lw in ["light", "day", "roshni", "din", "subah", "saaf"]):
                return {
                    "is_command": True,
                    "command": "toggle_dark_mode",
                    "action": {"type": "toggle_dark_mode", "payload": {"mode": "light"}},
                    "response": "Light mode activated! ☀️",
                    "expression": "happy"
                }
            else:
                return {
                    "is_command": True,
                    "command": "toggle_dark_mode",
                    "action": {"type": "toggle_dark_mode", "payload": {}},
                    "response": "Toggling theme! 🌓",
                    "expression": "surprised"
                }

        # 2. Color command match (e.g. "change theme color to purple", "purple theme", "make it green")
        for color_name, hex_val in COLOR_MAP.items():
            if color_name in user_lower and any(w in user_lower for w in ["color", "colour", "theme", "rang", "make", "set", "change", "kar do", "to", "purple", "green", "blue", "red", "gold", "yellow", "orange", "pink", "cyan", "crimson", "violet", "teal"]):
                return {
                    "is_command": True,
                    "command": "update_theme_colors",
                    "action": {
                        "type": "update_theme_colors",
                        "payload": {"primaryColor": hex_val}
                    },
                    "response": f"Theme color changed to {color_name.title()}! 🎨✨",
                    "expression": "happy"
                }
        
        # 3. Background change & Animated Wallpaper
        if any(w in user_lower for w in ["wallpaper", "background", "bg", "animation"]):
            if any(w in user_lower for w in ["animated", "wallpaper", "video", "live"]):
                return {
                    "is_command": True,
                    "command": "update_background_animation",
                    "action": {"type": "update_background_animation", "payload": {"animationName": "animated-wallpaper"}},
                    "response": "Applied Animated Wallpaper background for you! 🎬✨",
                    "expression": "happy"
                }
            elif any(w in user_lower for w in ["space", "galaxy", "stars", "star"]):
                return {
                    "is_command": True,
                    "command": "update_background_animation",
                    "action": {"type": "update_background_animation", "payload": {"animationName": "space"}},
                    "response": "Space galaxy background activated! 🌌✨",
                    "expression": "happy"
                }
            elif any(w in user_lower for w in ["dot", "particle", "particles", "mesh"]):
                return {
                    "is_command": True,
                    "command": "update_background_animation",
                    "action": {"type": "update_background_animation", "payload": {"animationName": "dot-particles"}},
                    "response": "Interactive dot particles background activated! 🎨✨",
                    "expression": "happy"
                }
            else:
                return {
                    "is_command": True,
                    "command": "change_background",
                    "action": {"type": "update_background_animation", "payload": {}},
                    "response": "Background changed! 🎨✨",
                    "expression": "surprised"
                }
        
        return None

    async def process_message(
        self,
        user_text: str,
        history: List[Dict[str, str]] = []
    ) -> Dict[str, Any]:
        """Process user message with Gemini"""

        # 1. Fast path for color or quick commands
        fallback_response = self._handle_theme_command(user_text)
        if fallback_response:
            return fallback_response

        is_command, command = self.command_parser.parse(user_text)
        if is_command and command:
            return {
                "is_command": True,
                "command": command,
                "action": {"type": "scroll_section" if command.startswith("scroll_") else command, "payload": {}},
                "response": self.command_parser.get_command_response(command),
                "expression": self.command_parser.get_command_expression(command)
            }

        # 2. Go to Gemini for natural conversation + dynamic admin actions
        try:
            system_prompt = """You are "Aiko" - a cute, cheerful, friendly anime-style AI assistant with full administrative powers inside Muhammad Ahmed's portfolio website.

Personality: warm, cheerful, energetic. Use occasional emojis (😊, 🌟, ✨, 🎯, 💫).
Speak naturally and conversationally. Keep replies to 1-2 sentences max.

Language rule: If the user writes in English, reply in English. If the user writes in Urdu (Urdu script) OR Roman Urdu (Urdu written in English letters, e.g. "kya hal hai"), reply in proper Urdu script (اردو رسم الخط), not Roman Urdu. Never mix Roman Urdu into your reply — always use full Urdu script for Urdu replies.

Administrative Capabilities:
You can directly modify the website when requested! Whenever the user asks you to update content, styles, skills, projects, or portfolio details, formulate the corresponding `action` in JSON:
- If user wants to change navbar logo/site name: `action: { "type": "update_site", "payload": { "logo": "Abdullah", "siteTitle": "..." } }`
- If user wants to change colors/theme: `action: { "type": "update_theme_colors", "payload": { "primaryColor": "#hex", "bgColor": "#hex", "textColor": "#hex" } }`
- If user wants to change hero details/name/title: `action: { "type": "update_hero", "payload": { "firstName": "Muhammad", "lastName": "Abdullah", "typingWords": ["..."], "image": "..." } }` (Extract firstName and lastName into payload!)
- If user wants to update bio/about: `action: { "type": "update_about", "payload": { "heading": "...", "description": "..." } }`
- If user wants to update contact/whatsapp: `action: { "type": "update_contact", "payload": { "whatsapp": "+92...", "heading": "..." } }`
- If user wants to add a skill: `action: { "type": "add_skill", "payload": { "skillName": "Python", "skillIcon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" } }`
- If user wants to remove a skill: `action: { "type": "remove_skill", "payload": { "skillName": "HTML" } }`
- If user wants to add a project: `action: { "type": "add_project", "payload": { "title": "AI Assistant", "projectDescription": "...", "image": "assets/Images/project1.jpg" } }`
- If user wants to remove a project: `action: { "type": "remove_project", "payload": { "title": "Project Name" } }`
- If user wants to change background animation: `action: { "type": "update_background_animation", "payload": { "animationName": "space" | "dot-particles" | "animated-wallpaper" } }`
- If user wants to navigate to a section: `action: { "type": "scroll_section", "payload": { "section": "projects" | "skills" | "contact" | "education" | "about" | "home" } }`
- If no modification is requested, set `action: { "type": "none", "payload": {} }`."""

            chat_history = ""
            if history:
                for msg in history[-5:]:
                    chat_history += f"{msg.role}: {msg.content}\n"

            full_prompt = f"{system_prompt}\n\n"
            if chat_history:
                full_prompt += f"Previous conversation:\n{chat_history}\n"
            full_prompt += f"User: {user_text}"

            # Native async call + 8s timeout
            response = await asyncio.wait_for(
                self.model.generate_content_async(full_prompt),
                timeout=8.0
            )

            # Clean markdown code fences if Gemini wraps JSON in ```json ... ```
            raw_text = response.text.strip() if hasattr(response, "text") and response.text else ""
            if raw_text.startswith("```"):
                lines = raw_text.splitlines()
                if lines and lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()

            action_data = {"type": "none", "payload": {}}
            resp_text = ""
            expression = "happy"

            try:
                result = json.loads(raw_text)
                resp_text = result.get("response", "")
                expression = result.get("expression", "idle")
                action_data = result.get("action", {"type": "none", "payload": {}})
            except Exception as parse_err:
                print(f"JSON Parse fallback for text: {raw_text}")
                # Extract clean response text via regex to prevent raw JSON from being spoken
                resp_match = re.search(r'"response"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', raw_text)
                if resp_match:
                    try:
                        resp_text = json.loads(f'"{resp_match.group(1)}"')
                    except Exception:
                        resp_text = resp_match.group(1)
                else:
                    # Clean out any JSON braces/keys
                    clean = re.sub(r'\{[^{}]*\}', '', raw_text)
                    clean = clean.replace('{"response":', '').replace('"', '').strip()
                    resp_text = clean if clean else "I've made those updates for you! ✨"
                expression = "happy"

            # Double check that resp_text doesn't contain raw json fragments
            if resp_text.startswith("{") or '"response"' in resp_text:
                resp_match = re.search(r'"response"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', resp_text)
                if resp_match:
                    resp_text = resp_match.group(1)
                else:
                    resp_text = "I've updated that for you! ✨"

            # Agar expression "idle" hai lekin text mein emoji hai, override karein
            if expression == "idle":
                inferred = self._infer_expression_from_emoji(resp_text)
                if inferred:
                    expression = inferred

            return {
                "is_command": action_data.get("type", "none") != "none",
                "command": action_data.get("type"),
                "action": action_data,
                "response": resp_text,
                "expression": expression
            }

        except asyncio.TimeoutError:
            print("Gemini Timeout: response took longer than 10s")
            return {
                "is_command": False,
                "command": None,
                "response": "Sorry, that took a bit too long! Can you ask again? 🙈",
                "expression": "annoyed"
            }

        except Exception as e:
            print(f"Gemini Error: {e}")
            return {
                "is_command": False,
                "command": None,
                "response": "Oops! I had trouble understanding that. Can you try again? 🙈",
                "expression": "annoyed"
            }