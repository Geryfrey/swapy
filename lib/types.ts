export interface User {
  id: string
  registrationNumber?: string // For students (9 digits starting with 2)
  email: string
  name: string
  role: "student" | "admin" | "super_admin"
  createdAt: Date
}

export interface MentalHealthCenter {
  id: string
  name: string
  address: string
  phone: string
  email: string
  specialties: string[]
  availability: string
  rating: number
  distance?: number
}

export interface Resource {
  id: string
  title: string
  type: "article" | "blog" | "video" | "guide"
  content: string
  summary: string
  tags: string[]
  author: string
  publishedAt: Date
  readTime: number
}

export interface Assessment {
  id: string
  studentId: string
  responses: Record<string, any>
  predictions: {
    conditions: string[]
    riskLevel: "critical" | "moderate" | "low"
    sentiment: "positive" | "negative" | "neutral"
    confidence: number
  }
  recommendations: {
    centers?: MentalHealthCenter[]
    resources: Resource[]
  }
  createdAt: Date
}

export interface JournalEntry {
  id: string
  studentId: string
  title: string
  content: string
  mood: string
  tags: string[]
  createdAt: Date
}

export interface Report {
  id: string
  type: "weekly" | "monthly" | "quarterly" | "yearly"
  period: string
  data: {
    totalAssessments: number
    riskDistribution: Record<string, number>
    commonConditions: Record<string, number>
    sentimentAnalysis: Record<string, number>
    trends: any[]
  }
  generatedAt: Date
}
