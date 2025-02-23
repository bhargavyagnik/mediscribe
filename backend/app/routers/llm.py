from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.llm import (
    get_medical_soap_note, 
    get_appointment_prerequisites,
    get_medical_referral_letter,
    get_transcription_summary
)

router = APIRouter()

class ConversationInput(BaseModel):
    text: str
    doctor_notes: str
    patient_information: str

class ConditionInput(BaseModel):
    condition: str

class TranscriptionInput(BaseModel):
    text: str

class PrerequisitesRequest(BaseModel):
    condition: str

@router.post("/soap-note")
async def create_soap_note(conversation: ConversationInput):
    try:
        return {"soap_note": await get_medical_soap_note(conversation.text, conversation.doctor_notes, conversation.patient_information)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/prerequisites")
async def get_prerequisites(request: PrerequisitesRequest):
    """
    Get prerequisites and preparation guidelines for a medical appointment based on condition.
    """
    try:
        prerequisites = await get_appointment_prerequisites(request.condition)
        return {"response": prerequisites}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/referral-letter")
async def create_referral_letter(conversation: ConversationInput):
    try:
        return {"referral_letter": await get_medical_referral_letter(
            conversation.text,
            conversation.doctor_notes,
            conversation.patient_information
        )}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transcription-summary")
async def create_transcription_summary(transcription: TranscriptionInput):
    try:
        return {"summary": await get_transcription_summary(transcription.text)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 