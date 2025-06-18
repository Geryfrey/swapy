"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/layout/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"
import type { User, Assessment } from "@/lib/types"
import { Brain, Calendar, AlertCircle, CheckCircle, Heart, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }
        setUser(currentUser)

        // Get assessment
        const { data: assessmentData, error } = await supabase
          .from("assessments")
          .select("*")
          .eq("id", params.id)
          .single()

        if (error) throw error
        setAssessment(assessmentData)
      } catch (error) {
        console.error("Error loading data:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading results...</p>
        </div>
      </div>
    )
  }

  if (!user || !assessment) return null

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskLevelIcon = (level?: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-4 w-4" />
      case "moderate":
        return <AlertCircle className="h-4 w-4" />
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "critical":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-red-600"
    if (score >= 50) return "text-orange-600"
    if (score >= 25) return "text-yellow-600"
    return "text-green-600"
  }

  const getSentimentColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-yellow-600"
    if (score >= 20) return "text-orange-600"
    return "text-red-600"
  }

  const getSentimentBadgeColor = (label: string) => {
    switch (label) {
      case "very_positive":
        return "bg-green-100 text-green-800 border-green-200"
      case "positive":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "negative":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "very_negative":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} />

      <div className="md:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(assessment.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <Badge className={`${getRiskLevelColor(assessment.risk_level)} flex items-center gap-1`}>
                {getRiskLevelIcon(assessment.risk_level)}
                {assessment.risk_level?.toUpperCase()} RISK
              </Badge>
            </div>
          </div>

          {/* Scores */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mental Health Indicators</CardTitle>
              <CardDescription>Your assessment scores across different mental health dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assessment.anxiety_score !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Anxiety</span>
                      <span className={getScoreColor(assessment.anxiety_score)}>{assessment.anxiety_score}/100</span>
                    </div>
                    <Progress value={assessment.anxiety_score} className="h-2" />
                  </div>
                )}

                {assessment.depression_score !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Depression</span>
                      <span className={getScoreColor(assessment.depression_score)}>
                        {assessment.depression_score}/100
                      </span>
                    </div>
                    <Progress value={assessment.depression_score} className="h-2" />
                  </div>
                )}

                {assessment.stress_score !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Stress</span>
                      <span className={getScoreColor(assessment.stress_score)}>{assessment.stress_score}/100</span>
                    </div>
                    <Progress value={assessment.stress_score} className="h-2" />
                  </div>
                )}

                {assessment.overall_wellbeing_score !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Overall Wellbeing</span>
                      <span className={getScoreColor(100 - assessment.overall_wellbeing_score)}>
                        {assessment.overall_wellbeing_score}/100
                      </span>
                    </div>
                    <Progress value={assessment.overall_wellbeing_score} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          {(assessment.sentiment_score !== undefined || assessment.sentiment_label) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Sentiment Analysis
                </CardTitle>
                <CardDescription>Analysis of emotional tone in your written responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessment.sentiment_score !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Sentiment Score</span>
                        <span className={getSentimentColor(assessment.sentiment_score)}>
                          {assessment.sentiment_score}/100
                        </span>
                      </div>
                      <Progress value={assessment.sentiment_score} className="h-2" />
                    </div>
                  )}

                  {assessment.sentiment_label && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Overall Sentiment:</span>
                      <Badge className={getSentimentBadgeColor(assessment.sentiment_label)}>
                        {assessment.sentiment_label.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis */}
          {assessment.ai_analysis && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
                <CardDescription>AI-powered assessment of your mental health status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{assessment.ai_analysis}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {assessment.recommendations && assessment.recommendations.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggested actions to improve your mental wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/resources" className="flex-1">
              <Button variant="outline" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Browse Resources
              </Button>
            </Link>

            <Link href="/appointments/book" className="flex-1">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Phone className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
