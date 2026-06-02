from backend import chat
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for MVP only
    allow_credentials=True,
    allow_methods=["*"],  # IMPORTANT (includes OPTIONS)
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")