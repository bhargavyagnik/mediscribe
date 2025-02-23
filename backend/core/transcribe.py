import os
from groq import Groq

def transcribe_audio(file_path: str) -> str:
    """Transcribe an audio file using Groq API."""
    client = Groq()

    with open(file_path, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(os.path.basename(file_path), file.read()),
            model="whisper-large-v3",
            response_format="verbose_json",
        )
        print(transcription.text)
        return transcription.text

if __name__ == "__main__":
    filename = os.path.join(os.path.dirname(__file__), "audio.m4a")  # Replace with your audio file path
    transcription = transcribe_audio(filename)
    print("Transcription:", transcription)
