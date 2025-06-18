"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/layout/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { Brain, ArrowLeft, ArrowRight } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const assessmentQuestions = [
  {
    id: "mood",
    category: "mood",
    question: "How would you describe your overall mood in the past week?",
    options: [
      { value: "1", label: "Very poor", score: 1 },
      { value: "2", label: "Poor", score: 2 },
      { value: "3", label: "Fair", score: 3 },
      { value: "4", label: "Good", score: 4 },
      { value: "5", label: "Excellent", score: 5 },
    ],
  },
  {
    id: "anxiety",
    category: "anxiety",
    question: "How often have you felt nervous, anxious, or on edge?",
    options: [
      { value: "1", label: "Nearly every day", score: 4 },
      { value: "2", label: "More than half the days", score: 3 },
      { value: "3", label: "Several days", score: 2 },
      { value: "4", label: "Not at all", score: 1 },
    ],
  },
  {
    id: "worry",
    category: "anxiety",
    question: "How often have you been unable to stop or control worrying?",
    options: [
      { value: "1", label: "Nearly every day", score: 4 },
      { value: "2", label: "More than half the days", score: 3 },
      { value: "3", label: "Several days", score: 2 },
      { value: "4", label: "Not at all", score: 1 },
    ],
  },
  {
    id: "interest",
    category: "depression",
    question: "How often have you had little interest or pleasure in doing things?",
    options: [
      { value: "1", label: "Nearly every day", score: 4 },
      { value: "2", label: "More than half the days", score: 3 },
      { value: "3", label: "Several days", score: 2 },
      { value: "4", label: "Not at all", score: 1 },
    ],
  },
  {
    id: "hopeless",
    category: "depression",
    question: "How often have you felt down, depressed, or hopeless?",
    options: [
      { value: "1", label: "Nearly every day", score: 4 },
      { value: "2", label: "More than half the days", score: 3 },
      { value: "3", label: "Several days", score: 2 },
      { value: "4", label: "Not at all", score: 1 },
    ],
  },
  {
    id: "sleep",
    category: "general",
    question: "How would you rate your sleep quality in the past week?",
    options: [
      { value: "1", label: "Very poor", score: 1 },
      { value: "2", label: "Poor", score: 2 },
      { value: "3", label: "Fair", score: 3 },
      { value: "4", label: "Good", score: 4 },
      { value: "5", label: "Excellent", score: 5 },
    ],
  },
  {
    id: "stress",
    category: "stress",
    question: "How stressed have you felt in the past week?",
    options: [
      { value: "1", label: "Extremely stressed", score: 5 },
      { value: "2", label: "Very stressed", score: 4 },
      { value: "3", label: "Moderately stressed", score: 3 },
      { value: "4", label: "Slightly stressed", score: 2 },
      { value: "5", label: "Not stressed at all", score: 1 },
    ],
  },
  {
    id: "concentration",
    category: "general",
    question: "How has your ability to concentrate been?",
    options: [
      { value: "1", label: "Very poor", score: 1 },
      { value: "2", label: "Poor", score: 2 },
      { value: "3", label: "Fair", score: 3 },
      { value: "4", label: "Good", score: 4 },
      { value: "5", label: "Excellent", score: 5 },
    ],
  },
  {
    id: "additional_thoughts",
    category: "general",
    question: "Please share any additional thoughts about how you've been feeling lately (optional)",
    options: [], // This will be handled as a text input
    isTextArea: true,
  },
]

export default function AssessmentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
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
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [assessmentQuestions[currentQuestion].id]: value,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateScores = () => {
    const scores = {
      anxiety: 0,
      depression: 0,
      stress: 0,
      general: 0,
    }

    assessmentQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        const option = question.options.find((opt) => opt.value === answer)
        if (option) {
          if (question.category === "anxiety") {
            scores.anxiety += option.score
          } else if (question.category === "depression") {
            scores.depression += option.score
          } else if (question.category === "stress") {
            scores.stress += option.score
          } else {
            scores.general += option.score
          }
        }
      }
    })

    // Normalize scores to 0-100 scale
    const anxietyScore = Math.round((scores.anxiety / 8) * 100) // 2 questions, max 4 each
    const depressionScore = Math.round((scores.depression / 8) * 100) // 2 questions, max 4 each
    const stressScore = Math.round((scores.stress / 5) * 100) // 1 question, max 5
    const wellbeingScore = Math.round(
      ((scores.general + (10 - scores.anxiety) + (10 - scores.depression) + (6 - scores.stress)) / 20) * 100,
    )

    return {
      anxiety_score: anxietyScore,
      depression_score: depressionScore,
      stress_score: stressScore,
      overall_wellbeing_score: wellbeingScore,
    }
  }

  const getRiskLevel = (scores: any) => {
    const avgScore = (scores.anxiety_score + scores.depression_score + scores.stress_score) / 3
    if (avgScore >= 75) return "critical"
    if (avgScore >= 50) return "high"
    if (avgScore >= 25) return "moderate"
    return "low"
  }

  const submitAssessment = async () => {
    if (!user) return

    setSubmitting(true)
    try {
      // Get student ID
      const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single()

      if (!student) throw new Error("Student profile not found")

      const scores = calculateScores()
      const riskLevel = getRiskLevel(scores)

      // Call AI API for analysis
      const aiResponse = await fetch("/api/analyze-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, scores, riskLevel }),
      })

      const aiData = await aiResponse.json()

      // Prepare assessment data with optional sentiment fields
      const assessmentData = {
        student_id: student.id,
        responses: answers,
        ...scores,
        risk_level: riskLevel,
        ai_analysis: aiData.analysis,
        recommendations: aiData.recommendations,
      }

      // Add sentiment data only if available
      if (aiData.sentiment_score !== undefined) {
        assessmentData.sentiment_score = aiData.sentiment_score
      }
      if (aiData.sentiment_label) {
        assessmentData.sentiment_label = aiData.sentiment_label
      }

      // Save assessment
      const { data: assessment, error } = await supabase.from("assessments").insert(assessmentData).select().single()

      if (error) throw error

      router.push(`/results/${assessment.id}`)
    } catch (error) {
      console.error("Error submitting assessment:", error)
      alert("Error submitting assessment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100
  const currentQ = assessmentQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === assessmentQuestions.length - 1
  const canProceed = answers[currentQ.id]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} />

      <div className="md:ml-64 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Assessment</h1>
            <p className="text-gray-600">
              Please answer the following questions honestly. This assessment will help us understand your current
              mental wellness.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {assessmentQuestions.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">{currentQ.question}</CardTitle>
              <CardDescription>Select the option that best describes your experience</CardDescription>
            </CardHeader>
            <CardContent>
              {currentQ.isTextArea ? (
                <Textarea
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Share your thoughts here..."
                  rows={4}
                  className="w-full"
                />
              ) : (
                <RadioGroup value={answers[currentQ.id] || ""} onValueChange={handleAnswer} className="space-y-4">
                  {currentQ.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={submitAssessment}
                disabled={!canProceed || submitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {submitting ? "Analyzing..." : "Complete Assessment"}
              </Button>
            ) : (
              <Button onClick={nextQuestion} disabled={!canProceed} className="bg-purple-600 hover:bg-purple-700">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
