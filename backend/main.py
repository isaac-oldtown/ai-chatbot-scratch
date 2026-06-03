from backend import chat
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chat API router
app.include_router(chat.router, prefix="/api")

# Index entry point
app.mount("/index", StaticFiles(directory="widget", html=True), name="frontend")
