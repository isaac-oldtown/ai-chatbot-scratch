## 🎯 Overview  
A sleek AI chatbot interface crafted for hands-on learning and exploration.

## 🏗️ Tech Stack
**Backend:**
- Python >= 3.11
- FastAPI (Web framework)
- Requests (HTTP client)

**Frontend:**
- Vanilla JavaScript (no frameworks)
- HTML5
- CSS

**Future Integration Plans:**
- Docker containerization
- Database (for session storage)
- RAG (Retrieval-Augmented Generation) for intelligent responses
- Environment management

## 🚀 Key Features
- Real-time chat interface with AI-powered responses
- RESTful API for chat operations

## 📂 Project Structure
```
ai-chatbot/
├── backend/
│   ├── chat.py          # Core chat logic and AI reply generation
│   ├── main.py          # FastAPI application setup
├── widget/              # Frontend
│   ├── index.html
│   ├── chat.js
│   └── styles.css
├── pyproject.toml       # Python project configuration
└── .env                 # API key for cloud LLM, bound to a free model
```

## 🔧 Setup Instructions
```bash
# Clone the repository
git clone https://github.com/isaac-oldtown/ai-chatbot.git
# Move to the project's root
cd ai-chatbot
# Install Python dependencies
uv sync
# Run backend server
uv run uvicorn backend.main:app --reload

# Access frontend
# Open widget/index.html in browser
```

## 🚧 Planned Enhancements
- [ ] **Containerization** with Docker for easy deployment
- [ ] **Database integration** for session persistence (PostgreSQL/Redis)
- [ ] **RAG implementation** for context-aware responses
- [ ] **User authentication** and session management
- [ ] **Dashboard for analytics** (conversation metrics, response times)
