from supabase import create_client, Client
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
import uuid

# Load environment variables from .env file
load_dotenv()

# Initialize Supabase client with environment variables
def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    # service_role_key = os.getenv("SERVICE_ROLE_KEY")
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env file")
    
    return create_client(url, key)

# Helper function to handle errors
def handle_error(response):
    """Handle Supabase response and errors."""
    if hasattr(response, 'error') and response.error:
        raise Exception(f"Supabase Error: {response.error}")
    
    if hasattr(response, 'data'):
        return response.data
    
    # If response is already data (new client might return data directly)
    return response

# 1. Doctor Operations (Read Only - get_db)
def get_doctors() -> List[Dict]:
    """Retrieve all doctors from the database."""
    supabase = get_supabase_client()
    response = supabase.table("doctor").select("*").execute()
    return handle_error(response)

# 2. Appointment CRUD Operations
def create_appointment(date: str, time: str, patient_id: str, type: str, doctor_id: str) -> Dict:
    """Create a new appointment."""
    supabase = get_supabase_client()
    appointment_id = str(uuid.uuid4())
    response = supabase.table("appointment").insert({
        "appointment_id": appointment_id,
        "date": date,
        "time": time,
        "patient_id": patient_id,
        "type": type,
        "doctor_id": doctor_id
    }).execute()
    return handle_error(response)[0]

def read_appointment(appointment_id: str) -> Optional[Dict]:
    """Read a specific appointment by ID."""
    supabase = get_supabase_client()
    response = supabase.table("appointment").select("*").eq("appointment_id", appointment_id).execute()
    data = handle_error(response)
    return data[0] if data else None

def update_appointment(appointment_id: str, date: Optional[str] = None, time: Optional[str] = None, 
                      patient_id: Optional[str] = None, type: Optional[str] = None, 
                      doctor_id: Optional[str] = None) -> Dict:
    """Update an existing appointment."""
    supabase = get_supabase_client()
    updates = {k: v for k, v in {
        "date": date,
        "time": time,
        "patient_id": patient_id,
        "type": type,
        "doctor_id": doctor_id
    }.items() if v is not None}
    response = supabase.table("appointment").update(updates).eq("appointment_id", appointment_id).execute()
    return handle_error(response)[0]

def delete_appointment(appointment_id: str) -> Dict:
    """Delete an appointment by ID."""
    supabase = get_supabase_client()
    response = supabase.table("appointment").delete().eq("appointment_id", appointment_id).execute()
    return handle_error(response)

# 3. Conversation CRUD Operations
def create_conversation(doctor_id: str, patient_id: str, appointment_id: str, text: str, summary: str) -> Dict:
    """Create a new conversation."""
    supabase = get_supabase_client()
    conversation_id = str(uuid.uuid4())
    response = supabase.table("conversation").insert({
        "conversation_id": conversation_id,
        "doctor_id": doctor_id,
        "patient_id": patient_id,
        "appointment_id": appointment_id,
        "text": text,
        "summary": summary
    }).execute()
    return handle_error(response)[0]

def read_conversation(conversation_id: str) -> Optional[Dict]:
    """Read a specific conversation by ID."""
    supabase = get_supabase_client()
    response = supabase.table("conversation").select("*").eq("conversation_id", conversation_id).execute()
    data = handle_error(response)
    return data[0] if data else None

def update_conversation(conversation_id: str, doctor_id: Optional[str] = None, patient_id: Optional[str] = None, 
                       appointment_id: Optional[str] = None, text: Optional[str] = None, 
                       summary: Optional[str] = None) -> Dict:
    """Update an existing conversation."""
    supabase = get_supabase_client()
    updates = {k: v for k, v in {
        "doctor_id": doctor_id,
        "patient_id": patient_id,
        "appointment_id": appointment_id,
        "text": text,
        "summary": summary
    }.items() if v is not None}
    response = supabase.table("conversation").update(updates).eq("conversation_id", conversation_id).execute()
    return handle_error(response)[0]

def delete_conversation(conversation_id: str) -> Dict:
    """Delete a conversation by ID."""
    supabase = get_supabase_client()
    response = supabase.table("conversation").delete().eq("conversation_id", conversation_id).execute()
    return handle_error(response)

# 4. Patient CRUD Operations
def create_patient(name: str, contact: str, medical_history: str, previous_procedures: str) -> Dict:
    """Create a new patient."""
    supabase = get_supabase_client()
    patient_id = str(uuid.uuid4())
    response = supabase.table("patient").insert({
        "id": patient_id,
        "name": name,
        "contact": contact,
        "medical_history": medical_history,
        "previous_procedures": previous_procedures
    }).execute()
    return handle_error(response)[0]

def read_patient(patient_id: str) -> Optional[Dict]:
    """Read a specific patient by ID."""
    supabase = get_supabase_client()
    response = supabase.table("patient").select("*").eq("id", patient_id).execute()
    data = handle_error(response)
    return data[0] if data else None

def update_patient(patient_id: str, name: Optional[str] = None, contact: Optional[str] = None, 
                   medical_history: Optional[str] = None, previous_procedures: Optional[str] = None) -> Dict:
    """Update an existing patient."""
    supabase = get_supabase_client()
    updates = {k: v for k, v in {
        "name": name,
        "contact": contact,
        "medical_history": medical_history,
        "previous_procedures": previous_procedures
    }.items() if v is not None}
    response = supabase.table("patient").update(updates).eq("id", patient_id).execute()
    return handle_error(response)[0]

def delete_patient(patient_id: str) -> Dict:
    """Delete a patient by ID."""
    supabase = get_supabase_client()
    response = supabase.table("patient").delete().eq("id", patient_id).execute()
    return handle_error(response)

def get_doctor_appointments_by_date(doctor_id: str, date: str) -> List[Dict]:
    """
    Get all appointments for a specific doctor on a specific date.
    Returns full appointment details.
    
    Args:
        doctor_id (str): The ID of the doctor
        date (str): The date in format 'YYYY-MM-DD'
    """
    supabase = get_supabase_client()
    response = supabase.table("appointment") \
        .select("*") \
        .eq("doctor_id", doctor_id) \
        .eq("date", date) \
        .execute()
    return handle_error(response)

def get_doctor_appointment_times(doctor_id: str, date: str) -> List[str]:
    """
    Get all appointment times for a specific doctor on a specific date.
    Returns only the times of appointments.
    
    Args:
        doctor_id (str): The ID of the doctor
        date (str): The date in format 'YYYY-MM-DD'
    """
    supabase = get_supabase_client()
    response = supabase.table("appointment") \
        .select("time") \
        .eq("doctor_id", doctor_id) \
        .eq("date", date) \
        .execute()
    
    data = handle_error(response)
    all_times = set(["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"])
    
    return list(all_times - set([appointment["time"] for appointment in data]))

# Example usage
if __name__ == "__main__":
    try:
        # Example: Get all appointments for a doctor on a specific date
        appointments = get_doctor_appointments_by_date(
            doctor_id="DR001",
            date="2025-02-22"
        )
        print("Doctor's appointments:", appointments)

        # Example: Get only appointment times
        times = get_doctor_appointment_times(
            doctor_id="DR001",
            date="2025-02-22"
        )
        print("Doctor's appointment times:", times)

    except Exception as e:
        print(f"Error: {e}")