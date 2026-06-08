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
└── .env                 # Stores environment variables, details below
                         # Also contains an API key for cloud LLM (may or may not work)
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
uv run uvicorn backend.main:app --reload    # See useful env variables below

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
docker run -p 8000:8000 ai-chatbot  # See useful env variables below

# Access http://localhost:8000/index/ from browser
```

### Environment variables :
Both methods support the following environment variables:
| Variable | Description                                                                              |
| -------- | ---------------------------------------------------------------------------------------- |
| `APP_ENV`| Set to `'test'` to get test messages, else, you'll perform a real API call to the `MODEL`|
| `MODEL`  | the LLM used by the chatbot, defaults to `openai/gpt-oss-20b:free`                       |
| `URL`    | the URL where `MODEL` lives, defaults to `https://openrouter.ai/api/v1/chat/completions` (should support any OpenAI-compatible API)|


## Planned Enhancements
- **Database integration** for session persistence (PostgreSQL/Redis)
- **RAG implementation** for context-aware responses
- **User authentication** and session management
- **Dashboard for analytics** (conversation metrics, response times)
