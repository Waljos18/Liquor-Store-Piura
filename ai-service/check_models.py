from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Modelos disponibles:")
for m in client.models.list():
    if "generateContent" in (m.supported_actions or []):
        print(" -", m.name)
