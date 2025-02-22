from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os
from core.transcribe import transcribe_audio

router = APIRouter()

@router.post("/audio")
async def transcribe_audio_file(file: UploadFile = File(...)):
    try:
        # Create a temporary file to store the uploaded audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            # Write the uploaded file content to the temporary file
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Transcribe the audio file
        transcription = transcribe_audio(temp_file_path)

        # Clean up the temporary file
        os.unlink(temp_file_path)

        return {"transcription": transcription}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 