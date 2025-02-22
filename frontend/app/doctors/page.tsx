"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

const appointments = [
  {
    id: 1,
    time: "09:00 AM",
    patient: "John Smith",
    reason: "Follow-up consultation",
    status: "upcoming",
  },
  {
    id: 2,
    time: "10:00 AM",
    patient: "Sarah Johnson",
    reason: "Initial consultation",
    status: "upcoming",
  },
  {
    id: 3,
    time: "11:30 AM",
    patient: "Michael Brown",
    reason: "Review test results",
    status: "upcoming",
  },
]

export default function DoctorDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="grid gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
                <p className="text-muted-foreground">Manage your appointments and patient records</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Today's Appointments</CardTitle>
                    <CardDescription>You have 5 appointments today</CardDescription>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Total Patients</CardTitle>
                    <CardDescription>You have 128 registered patients</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div> */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>View and manage your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">{appointment.time}</div>
                        <Button
                          variant="outline"
                          onClick={() => (window.location.href = `/consultation/${appointment.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

