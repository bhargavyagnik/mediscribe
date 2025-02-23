// API base URL
// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Type definitions based on OpenAPI schema
export interface Doctor {
  doctor_id: string;
  name: string;
  // Add other doctor fields as needed
}

export interface Appointment {
  appointment_id: string;
  date: string;
  time: string;
  patient_id: string;
  type: string;
  doctor_id: string;
}

export interface Patient {
  name: string;
  contact: string;
  medical_history: string;
  previous_procedures: string;
}

// API service functions
export const api = {
  // Doctors
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await fetch(`${API_BASE_URL}/doctors/`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return response.json();
  },

  // Appointments
  createAppointment: async (appointment: Appointment): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/appointments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    });
    if (!response.ok) throw new Error('Failed to create appointment');
    return response.json();
  },

  getDoctorAppointments: async (doctorId: string, date: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments/doctor/${doctorId}/date/${date}`);
    if (!response.ok) throw new Error('Failed to fetch doctor appointments');
    return response.json();
  },

  getDoctorAvailableTimes: async (doctorId: string, date: string): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments/doctor/${doctorId}/times/${date}`);
    if (!response.ok) throw new Error('Failed to fetch available times');
    return response.json();
  },

  // Conversations
  createConversation: async (conversation: {
    doctor_id: string;
    patient_id: string;
    appointment_id: string;
    text: string;
    summary: string;
  }): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/conversations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversation),
    });
    if (!response.ok) throw new Error('Failed to create conversation');
    return response.json();
  },

  // Transcription
  transcribeAudio: async (formData: FormData): Promise<Response> => {
    const response = await fetch(`${API_BASE_URL}/transcribe/audio`, {
      method: 'POST',
      body: formData,
      // headers: {'content-type': 'audio/wav'}
    });
    return response;
  },

  // LLM endpoints
  generateSoapNote: async (text: string, doctor_notes: string, patient_information: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/llm/soap-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, doctor_notes, patient_information }),
    });
    if (!response.ok) throw new Error('Failed to generate SOAP note');
    return response.json();
  },

  getPrerequisites: async (condition: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/llm/prerequisites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ condition }),
    });
    if (!response.ok) throw new Error('Failed to get prerequisites');
    return response.json();
  },

  generateTranscriptionSummary: (text: string) => {
    return fetch(`${API_BASE_URL}/llm/transcription-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })
  },

  generateReferralLetter: (text: string, doctor_notes: string, patient_information: string) => {
    return fetch(`${API_BASE_URL}/llm/referral-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text,
        doctor_notes,
        patient_information
      }),
    })
  },

  async getAppointmentPrerequisites(condition: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/llm/prerequisites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ condition }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to get prerequisites')
    }
    
    const data = await response.json()
    return data.response
  }
} 