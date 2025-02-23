from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import appointments, conversations, doctors, llm, patients, transcribe
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="Medical API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mediscribe-git-main-bhargavyagniks-projects.vercel.app/*","http://localhost:3000/*","https://mediscribe-alpha.vercel.app/*","https://*.bhargavyagnik.com/*","https://mediscribe-v92j.vercel.app/*","https://mediscribe-v92j.vercel.app/*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(doctors.router, prefix="/api/doctors", tags=["doctors"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
app.include_router(llm.router, prefix="/api/llm", tags=["llm"])
app.include_router(transcribe.router, prefix="/api/transcribe", tags=["transcribe"])

@app.get("/")
async def root():
    return {"message": "Welcome to Medical API"} 