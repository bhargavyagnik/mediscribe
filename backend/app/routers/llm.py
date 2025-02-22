from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.llm import get_medical_soap_note, get_appointment_prerequisites

router = APIRouter()

class ConversationInput(BaseModel):
    text: str

class ConditionInput(BaseModel):
    condition: str

@router.post("/soap-note")
async def create_soap_note(conversation: ConversationInput):
    try:
        return {"soap_note": await get_medical_soap_note(conversation.text)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/prerequisites")
async def get_prerequisites(condition: ConditionInput):
    try:
        return {"prerequisites": await get_appointment_prerequisites(condition.condition)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 