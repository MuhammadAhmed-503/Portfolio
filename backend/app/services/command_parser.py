from typing import Tuple, Optional

class CommandParser:
    def __init__(self):
        self.modification_words = [
            "add", "insert", "remove", "delete", "update", "edit", "change", 
            "set", "make", "create", "modify", "naam", "color", "colour", 
            "rang", "badlo", "hatao", "daalo", "likho", "likh"
        ]

        self.commands = {
            "change_background": {
                "keywords": [
                    "change background", "background change", "new background", 
                    "change bg", "animated wallpaper", "video wallpaper", "live wallpaper",
                    "space background", "particles background", "dot particles"
                ],
                "action": "change_background"
            },
            "scroll_education": {
                "keywords": ["scroll to education", "go to education", "show education", "open education", "education par jao"],
                "action": "scroll_education"
            },
            "scroll_projects": {
                "keywords": ["scroll to projects", "go to projects", "show projects", "open projects", "projects par jao"],
                "action": "scroll_projects"
            },
            "scroll_contact": {
                "keywords": ["scroll to contact", "go to contact", "show contact", "open contact", "contact par jao"],
                "action": "scroll_contact"
            },
            "scroll_home": {
                "keywords": ["go to home", "scroll to home", "go back to top", "go to top", "scroll to top", "home par jao"],
                "action": "scroll_home"
            },
            "toggle_dark_mode": {
                "keywords": [
                    "dark mode", "light mode", "dark mod", "light mod",
                    "dark theme", "light theme", "night mode", "day mode", 
                    "toggle dark mode", "switch theme", "toggle theme", 
                    "turn on dark mode", "turn on light mode", "mode to dark", "mode to light"
                ],
                "action": "toggle_dark_mode"
            },
            "scroll_skills": {
                "keywords": ["scroll to skills", "go to skills", "show skills", "open skills", "skills par jao"],
                "action": "scroll_skills"
            },
            "scroll_certificates": {
                "keywords": ["scroll to certificates", "go to certificates", "show certificates", "open certificates", "certificates par jao"],
                "action": "scroll_certificates"
            },
            "scroll_services": {
                "keywords": ["scroll to services", "go to services", "show services", "open services", "services par jao"],
                "action": "scroll_services"
            }
        }
    
    def parse(self, text: str) -> Tuple[bool, Optional[str]]:
        """Returns (is_command, command_action)"""
        text_lower = text.lower().strip()
        words = text_lower.split()
        
        # If user is asking to add/remove/edit/update something (e.g. "add python to my skills"), 
        # do NOT intercept as a simple navigation scroll — pass to Gemini!
        if any(mod in words for mod in self.modification_words):
            # Special exception: "change background" is a direct command
            if "change background" in text_lower or "new background" in text_lower or "change bg" in text_lower:
                return True, "change_background"
            return False, None

        for cmd_key, cmd_info in self.commands.items():
            for keyword in cmd_info["keywords"]:
                if keyword in text_lower:
                    return True, cmd_info["action"]
        
        return False, None
    
    def get_command_response(self, command: str) -> str:
        responses = {
            "change_background": "Background changed! 🎨",
            "change_image": "Profile image updated! 📸",
            "scroll_education": "Going to Education! 🎓",
            "scroll_projects": "Going to Projects! 🚀",
            "scroll_contact": "Going to Contact! 📧",
            "scroll_home": "Going to Home! 🏠",
            "toggle_dark_mode": "Theme toggled! 🌙☀️",
            "scroll_skills": "Going to Skills! 🛠️",
            "scroll_certificates": "Going to Certificates! 📜",
            "scroll_services": "Going to Services! ⚡"
        }
        return responses.get(command, "Command executed! ✨")
    
    def get_command_expression(self, command: str) -> str:
        happy = ["change_background", "change_image", "toggle_dark_mode"]
        excited = ["scroll_projects", "scroll_certificates", "scroll_skills", "scroll_services"]
        if command in happy:
            return "happy"
        elif command in excited:
            return "surprised"
        return "idle"