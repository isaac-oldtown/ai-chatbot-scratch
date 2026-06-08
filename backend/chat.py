import json
import os

import requests
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv(override=False)
OPENAI_KEY, URL, MODEL = os.getenv('OPENAI_KEY'), os.getenv('URL', 'https://openrouter.ai/api/v1/chat/completions'), os.getenv('MODEL', 'openai/gpt-oss-20b:free')

router = APIRouter()

initial_message=[{"role": "system", "content": "You are a helpful assistant for a chatbot MVP. Make short and helpful answers."}]
messages = initial_message

def generate_reply():
    if os.getenv('APP_ENV')=='test':
        return 'This is a test message, run the server with APP_ENV="prod" environment variable to perform real LLM calls.'
    else:
        headers = {
            "Authorization": f"Bearer {OPENAI_KEY}",
            "Content-Type": "application/json",
        }

        data = json.dumps({
            "model": MODEL,
            "messages": messages,
            "temperature": 0.7,
        })

        response = requests.post(URL, headers=headers, data=data)

        data = response.json()

        if "choices" in data:
            return data["choices"][0]["message"]["content"]

        return data.get("error", {}).get("message", "Unknown error")

@router.get("/messages")
def get_messages():
    return messages

@router.post("/messages/send")
def send_message(payload: dict):
    user_msg = payload.get("message")

    messages.append({"role": "user", "content": user_msg})
    reply = generate_reply()
    messages.append({"role": "assistant", "content": reply})

    return {"reply": reply}

@router.delete("/messages/reset")
def reset():
    global messages
    messages = initial_message
    return {"status": "reset"}