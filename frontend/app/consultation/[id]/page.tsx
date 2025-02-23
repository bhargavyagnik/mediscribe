"use client"

import { useState, useEffect } from "react"
import { Mic, Pause, Save, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useAudioRecorder } from "@/lib/hooks/useAudioRecorder"

interface Patient {
  id: string;
  name: string;
  contact: string;
  medical_history: string;
  previous_procedures: string;
}

async function blobToFile(blob: Blob): Promise<File> {
  const timestamp = new Date().getTime()
  return new File([blob], `recording-${timestamp}.wav`, { type: 'audio/wav' })
}

export default function ConsultationPage() {
  const params = useParams()
  const { id: appointmentId } = params
  const [notes, setNotes] = useState("")
  const [transcription, setTranscription] = useState("")
  const [loading, setLoading] = useState(true)
  const [transcribing, setTranscribing] = useState(false)
  const [appointment, setAppointment] = useState<any>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const [showSoapNotes, setShowSoapNotes] = useState(false)
  const [soapNotes, setSoapNotes] = useState("")
  const [referralLetter, setReferralLetter] = useState("")
  const [summary, setSummary] = useState("")

  const API_BASE_URL = process.env.API_BASE_URL;
  // Fetch appointment and patient details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [appointmentData] = await Promise.all([
          fetch(`${API_BASE_URL}/appointments/${appointmentId}`).then(res => res.json())
        ])
        setAppointment(appointmentData);
        const [patientData] = await Promise.all([
          fetch(`${API_BASE_URL}/patients/${appointmentData.patient_id}`).then(res => res.json())
        ])
        setPatient(patientData);
        console.log(patientData);
      } catch (error) {
        toast.error("Failed to fetch consultation details")
      } finally {
        setLoading(false)
      }
    }
    if (appointmentId) {
      fetchData()
    }
  }, [appointmentId])

  const handleRecording = async () => {
    try {
      if (!isRecording) {
        await startRecording()
      } else {
        setTranscribing(true)
        const audioBlob = await stopRecording()
        
        const audioFile = await blobToFile(audioBlob)
        const formData = new FormData()
        formData.append('file', audioFile)
        
        // Get transcription
        const response = await api.transcribeAudio(formData)
        if (!response.ok) {
          throw new Error('Transcription failed')
        }
        const { transcription } = await response.json()
        setTranscription(transcription)

        // Generate summary using the new endpoint
        const summaryResponse = await api.generateTranscriptionSummary(transcription)
        if (summaryResponse.ok) {
          const { summary } = await summaryResponse.json()
          setSummary(summary)
        }
        
        setTranscribing(false)
      }
    } catch (error) {
      console.error('Recording error:', error)
      toast.error(isRecording 
        ? "Failed to process recording" 
        : "Failed to start recording"
      )
      setTranscribing(false)
    }
  }

  const saveNotes = async () => {
    try {
      await api.createConversation({
        doctor_id: "DR001", // This would come from auth context
        patient_id: appointmentId as string,
        appointment_id: appointmentId as string,
        text: notes,
        summary: transcription
      })

      toast.success("Notes saved successfully")
    } catch (error) {
      toast.error("Failed to save notes")
    }
  }

  const handleToggle = () => {
    setShowSoapNotes(prev => !prev)
  }

  const handleGenerateSoapNotes = async () => {
    if (transcription.length === 0 && notes.length === 0) {
      toast.error("Transcription and Doctor's notes are required to generate SOAP notes.")
      return;
    }

    try {
      // Generate SOAP note using the LLM
      const soapNote = await api.generateSoapNote(
        transcription,
        notes,
        (patient?.medical_history || "") + (patient?.previous_procedures || "")
      );
      setSoapNotes(soapNote); // Set the generated SOAP notes
    } catch (error) {
      console.error("Error generating SOAP notes:", error);
      toast.error("Failed to generate SOAP notes.");
    }
  };

  const handleGenerateReferralLetter = async () => {
    if (transcription.length === 0 && notes.length === 0) {
      toast.error("Transcription and Doctor's notes are required to generate referral letter.")
      return;
    }

    try {
      const referralLetterResponse = await api.generateReferralLetter(
        transcription,
        notes,
        (patient?.medical_history || "") + (patient?.previous_procedures || "")
      );
      if (referralLetterResponse.ok) {
        const { referral_letter } = await referralLetterResponse.json()
        setReferralLetter(referral_letter)
      }
    } catch (error) {
      console.error("Error generating referral letter:", error)
      toast.error("Failed to generate referral letter.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="grid gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Patient Consultation</h1>
              <p className="text-muted-foreground">
                {patient?.name} - {appointment?.time}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation Notes</CardTitle>

                  </CardHeader>
                  <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        onClick={handleRecording}
                        disabled={transcribing}
                        className="w-full"
                      >
                        {transcribing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : isRecording ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Start Recording
                          </>
                        )}
                      </Button>
                      {isRecording && (
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-sm text-muted-foreground">Recording...</span>
                        </div>
                      )}
                    </div>
                    <Textarea
                      placeholder="Type your notes here..."
                      className="min-h-[300px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="flex space-x-4 mt-4">
                      <Button onClick={handleGenerateSoapNotes}>
                        Generate SOAP Notes
                      </Button>
                      <Button onClick={handleGenerateReferralLetter}>
                        Generate Referral Letter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>AI Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="summary">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
                        <TabsTrigger value="referral">Referral Letter</TabsTrigger>
                      </TabsList>
                      <TabsContent value="summary" className="mt-4">
                        <p className="text-sm">{summary || "Record a conversation to generate a summary"}</p>
                      </TabsContent>
                      <TabsContent value="soap" className="mt-4">
                        <p className="text-sm whitespace-pre-wrap">{soapNotes?.soap_note || "No SOAP notes generated yet."}</p>
                      </TabsContent>
                      <TabsContent value="referral" className="mt-4">
                        <p className="text-sm whitespace-pre-wrap">{referralLetter || "No referral letter generated yet."}</p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
              <Card>
                  <CardHeader>
                    <CardTitle>Prior Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="history">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="procedures">Procedures</TabsTrigger>
                      </TabsList>
                      <TabsContent value="history" className="mt-4">
                        <p className="text-sm">{patient?.medical_history}</p>
                      </TabsContent>
                      <TabsContent value="procedures" className="mt-4">
                        <p className="text-sm">{patient?.previous_procedures}</p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Conversation Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transcription ? (
                      <p className="text-sm whitespace-pre-wrap">{transcription}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No conversation transcript available yet
                      </p>
                    )}
                  </CardContent>
                </Card>
                
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

