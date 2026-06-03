# AI Chatbot Interface

A simple AI chatbot interface crafted for hands-on learning and exploration.

## Key Features
- Real-time chat interface with AI-powered responses
- RESTful API for chat operations

## Tech Stack
**Backend:**
- Python >= 3.11
- FastAPI (Web framework)
- Requests (HTTP client)

**Frontend:**
- Vanilla JavaScript (no frameworks)
- HTML5
- CSS

## Project Structure
```
ai-chatbot/
├── backend/
│   ├── chat.py          # Core chat logic and AI reply generation
│   ├── main.py          # FastAPI application setup
├── widget/              # Frontend
│   ├── index.html
│   ├── sidebar.html
│   ├── chat.js
│   └── styles.css
├── Dockerfile           # Docker build configuration
├── pyproject.toml       # Python project configuration
└── .env                 # Contains an API key for cloud LLM (may or may not work)
```

## Setup Instructions
### Using Python
```bash
# Clone the repository
git clone https://github.com/isaac-oldtown/ai-chatbot.git

# Move to the project's root
cd ai-chatbot

# Install Python dependencies
uv sync

# Run backend server
uv run uvicorn backend.main:app --reload  # Use APP_ENV='prod' to perform
                                          # real LLM call, otherwise you'll 
                                          # get a test message.

# Access http://localhost:8000/index/ from browser
```

### Using Docker
```bash
# Clone the repository
git clone https://github.com/isaac-oldtown/ai-chatbot.git

# Move to the project's root
cd ai-chatbot

# Build Docker container
docker build -t ai-chatbot .

# Run Docker container
docker run -p 8000:8000 ai-chatbot  # Use -e APP_ENV='prod' to perform true LLM call, otherwise you'll get a test message.

# Access http://localhost:8000/index/ from browser
```

## Planned Enhancements
- **Database integration** for session persistence (PostgreSQL/Redis)
- **RAG implementation** for context-aware responses
- **User authentication** and session management
- **Dashboard for analytics** (conversation metrics, response times)
