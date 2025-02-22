from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel
from core.crud import (
    create_conversation,
    read_conversation,
    update_conversation,
    delete_conversation
)

router = APIRouter()

class ConversationBase(BaseModel):
    doctor_id: str
    patient_id: str
    appointment_id: str
    text: str
    summary: str

class ConversationUpdate(BaseModel):
    doctor_id: Optional[str] = None
    patient_id: Optional[str] = None
    appointment_id: Optional[str] = None
    text: Optional[str] = None
    summary: Optional[str] = None

@router.post("/", response_model=dict)
async def create_new_conversation(conversation: ConversationBase):
    """Create a new conversation."""
    try:
        return create_conversation(**conversation.dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{conversation_id}", response_model=dict)
async def get_conversation(conversation_id: str):
    """Get a specific conversation by ID."""
    conversation = read_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

@router.put("/{conversation_id}", response_model=dict)
async def update_existing_conversation(conversation_id: str, conversation: ConversationUpdate):
    """Update an existing conversation."""
    try:
        return update_conversation(conversation_id, **conversation.dict(exclude_unset=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{conversation_id}")
async def delete_existing_conversation(conversation_id: str):
    """Delete a conversation by ID."""
    try:
        return delete_conversation(conversation_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 