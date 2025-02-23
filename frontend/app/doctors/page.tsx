"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { api, Appointment } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function DoctorDashboard() {
  const [date, setDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch appointments when date changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const doctorId = "DR001" // This would come from auth context
        const formattedDate = format(date, 'yyyy-MM-dd')
        const appointmentsList = await api.getDoctorAppointments(doctorId, formattedDate)
        setAppointments(appointmentsList)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [date])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="grid gap-8">
            <div className="flex items-center justify-between">
              <div>
              <h5>[demo: Doctor ID: DR001 assumed for now]</h5>
                <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
                <p className="text-muted-foreground">Manage your appointments and patient records</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Today's Appointments</CardTitle>
                    <CardDescription>
                      {loading ? "Loading..." : `${appointments.length} appointments today`}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>View and manage your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">Loading appointments...</div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No appointments scheduled for this day
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div
                        key={appointment.patient_id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">Patient ID: {appointment.patient_id}</p>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-muted-foreground">{appointment.time}</div>
                          <Button
                            variant="outline"
                            onClick={() => window.location.href = `/consultation/${appointment.appointment_id}`}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

