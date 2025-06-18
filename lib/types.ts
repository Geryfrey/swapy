export interface User {
  id: string
  email: string
  full_name: string
  role: "student" | "health_professional" | "admin"
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  student_id?: string
  date_of_birth?: string
  phone?: string
  emergency_contact?: string
  emergency_phone?: string
  user?: User
}

export interface HealthProfessional {
  id: string
  user_id: string
  license_number?: string
  specialization?: string
  phone?: string
  location?: string
  availability_hours?: any
  is_approved: boolean
  user?: User
}

export interface Assessment {
  id: string
  student_id: string
  responses: any
  anxiety_score?: number
  depression_score?: number
  stress_score?: number
  overall_wellbeing_score?: number
  sentiment_score?: number
  sentiment_label?: "very_negative" | "negative" | "neutral" | "positive" | "very_positive"
  ai_analysis?: string
  recommendations?: string[]
  risk_level?: "low" | "moderate" | "high" | "critical"
  created_at: string
}

export interface Resource {
  id: string
  title: string
  description?: string
  content?: string
  resource_type: "article" | "video" | "audio" | "pdf" | "external_link"
  url?: string
  category?: string
  tags?: string[]
  is_featured: boolean
  created_by?: string
  created_at: string
}

export interface Appointment {
  id: string
  student_id: string
  health_professional_id: string
  assessment_id?: string
  appointment_date: string
  duration_minutes: number
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled"
  notes?: string
  student_notes?: string
  professional_notes?: string
  created_at: string
  updated_at: string
  student?: Student
  health_professional?: HealthProfessional
}
