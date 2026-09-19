# 🚀 Muhammad Ahmed | Full-Stack Developer & AI Portfolio

Welcome to the repository for **Muhammad Ahmed's Personal Portfolio Website**. This project showcases modern web engineering, interactive UI/UX designs, and an intelligent AI voice assistant powered by Google Gemini and Edge-TTS.

🌐 **Live Demo:** [https://muhammadahmed-503.github.io/Portfolio/](https://muhammadahmed-503.github.io/Portfolio/)

---

## ✨ Features

- **⚡ Modern Responsive UI**: Glassmorphic theme, dark/light contrast styling, smooth micro-animations, and mobile responsiveness.
- **🎙️ Real-time AI Voice Assistant**:
  - Interactive voice conversations powered by **Google Gemini AI**.
  - Natural speech synthesis using **Edge-TTS** with audio streaming and response caching.
  - Interactive portfolio commands (navigation, project insights, contact actions).
- **🗄️ Supabase Backend Integration**:
  - Contact messages storage with automated schema and migrations.
  - Dynamic analytics and feedback management.
- **📱 Progressive Web App (PWA)**:
  - Offline caching with Service Workers and custom `manifest.json`.
- **🔍 SEO & Performance Optimized**:
  - Comprehensive Open Graph / Twitter Cards metadata.
  - Schema.org JSON-LD Structured Data for rich search snippets.
  - Clean semantic HTML structure, `robots.txt`, and XML sitemap.

---

## 🛠️ Tech Stack

### Frontend
- **Core**: HTML5, Vanilla JavaScript (ES6+), Modern CSS3 (Custom Properties, Flexbox/Grid, Glassmorphism)
- **Icons & Fonts**: Lucide / FontAwesome, Google Fonts (Outfit, Inter)
- **Database / BaaS**: Supabase JS Client

### Backend (AI Voice Assistant)
- **Framework**: FastAPI & Uvicorn (Asynchronous Python API)
- **LLM Engine**: Google Gemini API (`google-generativeai`)
- **Speech Synthesis (TTS)**: Microsoft Edge-TTS (`edge-tts`)
- **Transport**: WebSockets & REST APIs

---

## 📁 Project Structure

```bash
├── frontend/
│   ├── assets/
│   │   ├── CSS/               # Custom stylesheets and themes
│   │   ├── Images/            # Project previews, avatars, and assets
│   │   └── SCRIPT/            # Frontend logic and voice assistant client
│   ├── admin/                 # Admin management views
│   ├── index.html             # Main portfolio entry point
│   ├── manifest.json          # PWA configuration
│   ├── service-worker.js      # Offline caching & performance
│   ├── robots.txt             # Search engine crawler configuration
│   ├── sitemap.xml            # SEO sitemap
│   └── SUPABASE_MIGRATION.sql # Supabase database schema
│
├── backend/
│   ├── app/
│   │   ├── routes/            # FastAPI route handlers (voice, health)
│   │   ├── services/          # Gemini AI & Edge-TTS voice services
│   │   ├── config.py          # Environment settings
│   │   └── main.py            # FastAPI entry point
│   ├── requirements.txt       # Python dependencies
│   └── run.py                 # Backend runner script
│
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/MuhammadAhmed-503/Portfolio.git
cd Portfolio
```

### 2. Frontend Setup
You can serve the frontend using any static file server or VS Code Live Server:
```bash
# Example with Python's built-in server
cd frontend
python -m http.server 5500
```
Open your browser at `http://localhost:5500`.

### 3. Backend Setup (AI Voice Assistant)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8000
   ALLOWED_ORIGINS=http://localhost:5500,https://muhammadahmed-503.github.io
   ```
5. Run the backend server:
   ```bash
   python run.py
   # or
   uvicorn app.main:app --reload --port 8000
   ```

---

## 📬 Contact & Socials

- **Muhammad Ahmed**
- **GitHub:** [@MuhammadAhmed-503](https://github.com/MuhammadAhmed-503)
- **LinkedIn:** [Muhammad Ahmed](https://www.linkedin.com/in/muhammad-ahmed-238459288)
- **Instagram:** [@o.ahmed503](https://www.instagram.com/o.ahmed503)

---

⭐ *If you find this project inspiring or useful, feel free to give it a star!*
