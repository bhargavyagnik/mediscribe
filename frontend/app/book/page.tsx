"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { api, Doctor } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Send } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { cn } from "@/lib/utils"

// Add these interfaces for chat messages
interface Message {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
}

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: ""
  })
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [typingContent, setTypingContent] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsList = await api.getDoctors()
        setDoctors(doctorsList)
        if (doctorsList.length > 0) {
          setSelectedDoctor(doctorsList[0].doctor_id)
          console.log('Doctors:', doctorsList)
        }
        console.log('Doctors:', selectedDoctor)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch doctors",
          variant: "destructive"
        })
      }
    }
    fetchDoctors()
  }, [])

  // Fetch available times when date or doctor changes
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (date && selectedDoctor) {
        try {
          const times = await api.getDoctorAvailableTimes(
            selectedDoctor,
            format(date, 'yyyy-MM-dd')
          )
          setAvailableTimes(times)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch available times",
            variant: "destructive"
          })
        }
      }
    }
    fetchAvailableTimes()
  }, [date, selectedDoctor])

  // Add this effect to scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleDoctorChange = (value: string) => {
    console.log('Selected doctor ID:', value)
    setSelectedDoctor(value)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !selectedTime || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      await api.createAppointment({
        appointment_id: `${format(date, 'yyyyMMdd')}-${selectedDoctor}-${selectedTime}`.replace(/[^a-zA-Z0-9-]/g, ''),
        date: format(date, 'yyyy-MM-dd'),
        time: selectedTime,
        doctor_id: selectedDoctor,
        patient_id: "PT001", // This would come from auth context in a real app
        type: formData.reason
      })

      toast({
        title: "Success",
        description: "Appointment booked successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive"
      })
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      role: 'user' as const,
      content: inputMessage
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await api.getAppointmentPrerequisites(inputMessage)
      
      // Add a temporary typing message
      const tempMessage = {
        role: 'assistant' as const,
        content: response,
        isTyping: true
      }
      
      setMessages(prev => [...prev, tempMessage])
      setTypingContent(response)
      setTypingIndex(0)
      
      // Animate the typing effect
      const typeText = () => {
        setTypingIndex(prev => {
          if (prev < response.length) {
            setTimeout(typeText, 30) // Adjust speed here
            return prev + 1
          }
          // When done typing, replace with final message
          setMessages(prev => prev.map((msg, idx) => 
            idx === prev.length - 1 
              ? { ...msg, isTyping: false, content: response }
              : msg
          ))
          return prev
        })
      }
      
      typeText()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the assistant",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const LoadingIndicator = () => {
    const [stage, setStage] = useState<'searching' | 'typing'>('searching')
    const [dots, setDots] = useState('')

    useEffect(() => {
      // Switch from searching to typing after 3 seconds
      const stageTimer = setTimeout(() => {
        setStage('typing')
      }, 3000)

      // Animate the dots
      const dotsTimer = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.')
      }, 500)

      return () => {
        clearTimeout(stageTimer)
        clearInterval(dotsTimer)
      }
    }, [])

    return (
      <div className="text-sm">
        {stage === 'searching' ? 'Searching' : 'Typing'}
        {dots}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="mx-auto max-w-[800px] space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
              <p className="text-muted-foreground">
                Choose your preferred doctor, date, and time for your appointment.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Doctor & Time</CardTitle>
                  <CardDescription>Choose your preferred appointment slot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Select Doctor</Label>
                    <Select value={selectedDoctor} onValueChange={(value) => handleDoctorChange(value)}>
                      <SelectTrigger id="doctor">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors?.map((doctor) => (
                          <SelectItem key={doctor.doctor_id} value={doctor.doctor_id}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Select Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Discuss Your Visit</CardTitle>
                  <CardDescription>Chat with our assistant about your condition and get preparation guidelines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    ref={chatContainerRef}
                    className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4"
                  >
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.role === 'assistant' && message.isTyping ? (
                            typingContent.slice(0, typingIndex)
                          ) : message.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert">
                              <ReactMarkdown>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && !messages.find(m => m.isTyping) && (
                      <div className="flex justify-start">
                        <div className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2 bg-muted",
                          "flex items-center"
                        )}>
                          <LoadingIndicator />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Describe your condition or ask about preparations..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button 
                      type="button"
                      onClick={handleSendMessage}
                      disabled={isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              
              <div className="md:col-span-2">
                <Button type="submit" size="lg" className="w-full">
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

