"use client"

import { useState } from "react"
import { Mic, Pause, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConsultationPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [notes, setNotes] = useState("")

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="grid gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Patient Consultation</h1>
              <p className="text-muted-foreground">John Smith - 9:00 AM Appointment</p>
            </div>
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation Notes</CardTitle>
                    <CardDescription>Record and take notes during the consultation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        onClick={toggleRecording}
                        className="w-full"
                      >
                        {isRecording ? (
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
                    <Button className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Notes
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>AI Summary</CardTitle>
                    <CardDescription>Automatically generated summary from the recorded conversation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      The summary will appear here after the consultation recording is processed...
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                        <dd>John Smith</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Age</dt>
                        <dd>45</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Contact</dt>
                        <dd>+1 234 567 890</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="conditions">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="conditions">Conditions</TabsTrigger>
                        <TabsTrigger value="medications">Medications</TabsTrigger>
                        <TabsTrigger value="allergies">Allergies</TabsTrigger>
                      </TabsList>
                      <TabsContent value="conditions" className="space-y-4">
                        <ul className="list-disc pl-4 text-sm">
                          <li>Hypertension</li>
                          <li>Type 2 Diabetes</li>
                        </ul>
                      </TabsContent>
                      <TabsContent value="medications" className="space-y-4">
                        <ul className="list-disc pl-4 text-sm">
                          <li>Metformin 500mg</li>
                          <li>Lisinopril 10mg</li>
                        </ul>
                      </TabsContent>
                      <TabsContent value="allergies" className="space-y-4">
                        <ul className="list-disc pl-4 text-sm">
                          <li>Penicillin</li>
                        </ul>
                      </TabsContent>
                    </Tabs>
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

