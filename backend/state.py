from dotenv import load_dotenv
import os

# Contains all data
class Memory:
    def __init__(self):

        # Loading environment
        load_dotenv(override=False)
        self.OPENAI_KEY, self.URL, self.MODEL, self.APP_ENV = (
            os.getenv("OPENAI_KEY"),
            os.getenv("URL", "https://openrouter.ai/api/v1/chat/completions"),
            os.getenv("MODEL", "openai/gpt-oss-20b:free"),
            os.getenv("APP_ENV", "prod")
        )

        # Default values
        self.INITIAL_MESSAGE = [
            {
                "role": "system",
                "content": """You are a helpful assistant for a chatbot MVP. Provide short, clear, and useful answers.
When the user provides documents, treat them as the primary source of truth.
If the answer can be found in a document, use it to respond, explicitly reference where it appears, and include a relevant quote from the text.""",
            }
        ]
        self.CHAT_HISTORY = self.INITIAL_MESSAGE
        self.RAW_DOCUMENTS = {}
        self.DOCUMENTS_TEXT = {}

STATE = Memory()