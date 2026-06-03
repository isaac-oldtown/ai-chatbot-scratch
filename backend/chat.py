import json
import os

import requests
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY")

router = APIRouter()

initial_message=[
    {"role": "bot", "text": "Hello"}
]
messages = initial_message

def generate_reply(user_text: str):
    if os.getenv('APP_ENV')=='prod':
        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {OPENAI_KEY}",
            "Content-Type": "application/json",
        }

        data = json.dumps({
            "model": "openai/gpt-oss-20b:free",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant for a chatbot MVP. Make short and helpful answers."},
                {"role": "user", "content": user_text}
            ],
            "temperature": 0.7
        })

        response = requests.post(url, headers=headers, data=data)

        data = response.json()

        if "choices" in data:
            return data["choices"][0]["message"]["content"]

        return data.get("error", {}).get("message", "Unknown error")
    
    else:
        return 'This is a test message, run the server with APP_ENV="prod" to perform real LLM calls.'


@router.get("/messages")
def get_messages():
    return messages

@router.post("/messages/send")
def send_message(payload: dict):
    user_msg = payload.get("message")

    messages.append({"role": "user", "text": user_msg})
    reply = generate_reply(user_msg)
    messages.append({"role": "bot", "text": reply})

    return {"reply": reply}

@router.delete("/messages/reset")
def reset():
    global messages
    messages = initial_message
    return {"status": "reset"}