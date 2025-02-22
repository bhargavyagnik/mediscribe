from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel
from core.crud import (
    create_patient,
    read_patient,
    update_patient,
    delete_patient
)

router = APIRouter()

class PatientBase(BaseModel):
    name: str
    contact: str
    medical_history: str
    previous_procedures: str

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    contact: Optional[str] = None
    medical_history: Optional[str] = None
    previous_procedures: Optional[str] = None

@router.post("/", response_model=dict)
async def create_new_patient(patient: PatientBase):
    """Create a new patient."""
    try:
        return create_patient(**patient.dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{patient_id}", response_model=dict)
async def get_patient(patient_id: str):
    """Get a specific patient by ID."""
    patient = read_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=dict)
async def update_existing_patient(patient_id: str, patient: PatientUpdate):
    """Update an existing patient."""
    try:
        return update_patient(patient_id, **patient.dict(exclude_unset=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{patient_id}")
async def delete_existing_patient(patient_id: str):
    """Delete a patient by ID."""
    try:
        return delete_patient(patient_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 