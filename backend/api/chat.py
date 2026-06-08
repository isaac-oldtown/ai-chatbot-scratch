from fastapi import APIRouter
from backend import services

router = APIRouter()

@router.get("/")
def get_messages():
    return services.get_chat_history()

@router.post("/send")
def send_message(payload: dict):
    return services.send_message(payload=payload)

@router.delete("/reset")
def reset():
    return services.reset()