"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

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
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                  <CardDescription>Choose your preferred appointment slot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>Please provide your details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      placeholder="Briefly describe your reason for visiting"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" className="w-full">
              Confirm Booking
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

