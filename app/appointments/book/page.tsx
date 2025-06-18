"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/layout/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"
import type { User, HealthProfessional } from "@/lib/types"
import { CalendarIcon, Clock, UserIcon } from "lucide-react"
import { format } from "date-fns"

export default function BookAppointmentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [professionals, setProfessionals] = useState<HealthProfessional[]>([])
  const [selectedProfessional, setSelectedProfessional] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }
        if (currentUser.role !== "student") {
          router.push("/dashboard")
          return
        }
        setUser(currentUser)

        // Get health professionals
        const { data: professionalsData, error } = await supabase
          .from("health_professionals")
          .select(`
            *,
            user:users(*)
          `)
          .eq("is_approved", true)

        if (error) throw error
        setProfessionals(professionalsData || [])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedProfessional || !selectedDate || !selectedTime) return

    setSubmitting(true)
    try {
      // Get student ID
      const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single()

      if (!student) throw new Error("Student profile not found")

      // Create appointment
      const appointmentDate = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":").map(Number)
      appointmentDate.setHours(hours, minutes)

      const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({
          student_id: student.id,
          health_professional_id: selectedProfessional,
          appointment_date: appointmentDate.toISOString(),
          duration_minutes: 60,
          status: "pending",
          student_notes: notes,
        })
        .select()
        .single()

      if (error) throw error

      router.push("/appointments")
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Error booking appointment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = []
  for (let hour = 9; hour < 17; hour++) {
    const formattedHour = hour.toString().padStart(2, "0")
    timeSlots.push(`${formattedHour}:00`)
    timeSlots.push(`${formattedHour}:30`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} />

      <div className="md:ml-64 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
            <p className="text-gray-600">Schedule a meeting with a mental health professional</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Fill in the details to book your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Professional Selection */}
                <div className="space-y-2">
                  <Label htmlFor="professional">Health Professional</Label>
                  <Select value={selectedProfessional} onValueChange={setSelectedProfessional} required>
                    <SelectTrigger id="professional" className="w-full">
                      <SelectValue placeholder="Select a health professional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map((professional) => (
                        <SelectItem key={professional.id} value={professional.id}>
                          {professional.user?.full_name} - {professional.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Appointment Date</Label>
                  <div className="border rounded-md p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        // Disable past dates and weekends
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const day = date.getDay()
                        return date < today || day === 0 || day === 6
                      }}
                      className="mx-auto"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time">Appointment Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!selectedDate} required>
                    <SelectTrigger id="time" className="w-full">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Please share any specific concerns or information that might be helpful for the professional"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Summary */}
                {selectedProfessional && selectedDate && selectedTime && (
                  <Card className="bg-gray-50 border">
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">Appointment Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                          <span>{professionals.find((p) => p.id === selectedProfessional)?.user?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span>{selectedDate && format(selectedDate, "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{selectedTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!selectedProfessional || !selectedDate || !selectedTime || submitting}
                >
                  {submitting ? "Booking..." : "Book Appointment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
