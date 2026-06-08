from backend.state import STATE
import requests
from pypdf import PdfReader


# ================= CHAT SERVICES ================= #
def generate_reply():
    if STATE.APP_ENV == "test":
        return 'This is a test message, run the server with APP_ENV="prod" environment variable to perform real LLM calls.'
    else:
        headers = {
            "Authorization": f"Bearer {STATE.OPENAI_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": STATE.MODEL,
            "messages": STATE.CHAT_HISTORY,
            "stream": False,
            "think": False,
        }

        response = requests.post(headers=headers, url=STATE.URL, json=payload)

        response.raise_for_status()
        data = response.json()

        if "message" in data and "content" in data["message"]:
            return data["message"]["content"]

        return data


def get_chat_history():
    return STATE.CHAT_HISTORY


def send_message(payload: dict):
    user_msg = payload.get("message")
    STATE.CHAT_HISTORY.append({"role": "user", "content": user_msg})
    reply = generate_reply()
    STATE.CHAT_HISTORY.append({"role": "assistant", "content": reply})

    return {"reply": reply}


def reset():
    STATE.CHAT_HISTORY = STATE.INITIAL_MESSAGE
    return {"status": "reset"}


# ================= DOCUMENT SERVICES ================= #


def extract_text(file: "UploadFile"):
    pdf = PdfReader(file.file)

    return "\n".join(page.extract_text() or "" for page in pdf.pages)


def upload_document(file: "UploadFile" = "File()"):
    try:
        pdf = PdfReader(file.file)

        text = "\n".join(page.extract_text() or "" for page in pdf.pages)

        STATE.RAW_DOCUMENTS.update({file.filename: file.file})
        STATE.DOCUMENTS_TEXT.update({file.filename: text})

        send_message(
            {
                "message": f"The user just loaded a ducument called {file.filename}. Here is its content :\n\n{text}" # send message without showing it with addMessage function in chat.js 
            }
        )

        return {'error': 0, "text": ""}

    except Exception as e:
        return {'error': 1, "text": e}