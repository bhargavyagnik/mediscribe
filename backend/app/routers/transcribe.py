from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os
from core.transcribe import transcribe_audio

router = APIRouter()

@router.post("/audio")
async def transcribe_audio_file(file: UploadFile = File(...)):
    try:
        # Validate file type
        allowed_types = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/webm"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file.content_type} not supported. Must be one of: {allowed_types}"
            )

        # Create a temporary file to store the uploaded audio
        suffix = os.path.splitext(file.filename)[1] or ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            # Read chunks of the file instead of all at once
            while content := await file.read(1024 * 1024):  # Read 1MB at a time
                temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Transcribe the audio file
            transcription = transcribe_audio(temp_file_path)
            return {"transcription": transcription}
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 