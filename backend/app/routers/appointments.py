from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import date
from core.crud import (
    create_appointment,
    read_appointment,
    update_appointment,
    delete_appointment,
    get_doctor_appointments_by_date,
    get_doctor_appointment_times
)

router = APIRouter()

class AppointmentBase(BaseModel):
    date: str
    time: str
    patient_id: str
    type: str
    doctor_id: str

class AppointmentUpdate(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    patient_id: Optional[str] = None
    type: Optional[str] = None
    doctor_id: Optional[str] = None

@router.post("/", response_model=dict)
async def create_new_appointment(appointment: AppointmentBase):
    try:
        return create_appointment(**appointment.dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{appointment_id}", response_model=dict)
async def get_appointment(appointment_id: str):
    appointment = read_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.put("/{appointment_id}", response_model=dict)
async def update_existing_appointment(appointment_id: str, appointment: AppointmentUpdate):
    try:
        return update_appointment(appointment_id, **appointment.dict(exclude_unset=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{appointment_id}")
async def delete_existing_appointment(appointment_id: str):
    try:
        return delete_appointment(appointment_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/doctor/{doctor_id}/date/{date}", response_model=List[dict])
async def get_doctor_appointments(doctor_id: str, date: str):
    try:
        return get_doctor_appointments_by_date(doctor_id, date)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/doctor/{doctor_id}/times/{date}", response_model=List[str])
async def get_doctor_times(doctor_id: str, date: str):
    try:
        return get_doctor_appointment_times(doctor_id, date)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 