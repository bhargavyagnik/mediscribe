from fastapi import APIRouter, HTTPException
from typing import List
from core.crud import get_doctors

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_all_doctors():
    """Get all doctors from the database."""
    try:
        return get_doctors()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 