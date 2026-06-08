from backend.api import chat
from backend.api import documents
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
app.include_router(chat.router, prefix="/api/chat")
# Documents API router
app.include_router(documents.router, prefix="/api/documents")

# Index entry point
app.mount("/index", StaticFiles(directory="widget", html=True), name="frontend")
