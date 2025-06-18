"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"
import type { User, Assessment } from "@/lib/types"
import { Brain, BarChart3, Heart, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [recentAssessment, setRecentAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }
        setUser(currentUser)

        // Get recent assessment for students
        if (currentUser.role === "student") {
          const { data: student } = await supabase.from("students").select("id").eq("user_id", currentUser.id).single()

          if (student) {
            const { data: assessment } = await supabase
              .from("assessments")
              .select("*")
              .eq("student_id", student.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single()

            setRecentAssessment(assessment)
          }
        }
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

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

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100"
      case "moderate":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-orange-600 bg-orange-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} />

      <div className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.full_name.split(" ")[0]}!</h1>
            <p className="text-gray-600">
              {user.role === "student" && "Take care of your mental wellness journey"}
              {user.role === "health_professional" && "Manage your appointments and support students"}
              {user.role === "admin" && "Oversee the wellness platform"}
            </p>
          </div>

          {/* Student Dashboard */}
          {user.role === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Quick Assessment */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Quick Assessment
                  </CardTitle>
                  <CardDescription>Take a quick mental health check</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/assessment">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Assessment</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Assessment History */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Assessment History
                  </CardTitle>
                  <CardDescription>View your past assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentAssessment && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Latest Result:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(recentAssessment.risk_level)}`}
                        >
                          {recentAssessment.risk_level?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(recentAssessment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <Link href="/results">
                    <Button variant="outline" className="w-full">
                      View Results
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Resources */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Resources
                  </CardTitle>
                  <CardDescription>Access helpful resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/resources">
                    <Button variant="outline" className="w-full">
                      Browse Resources
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Wellness Journey Section for Students */}
          {user.role === "student" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Your Wellness Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Track your mental wellness over time</p>
                  {recentAssessment ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recentAssessment.anxiety_score && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{recentAssessment.anxiety_score}</div>
                            <div className="text-sm text-gray-600">Anxiety</div>
                          </div>
                        )}
                        {recentAssessment.depression_score && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{recentAssessment.depression_score}</div>
                            <div className="text-sm text-gray-600">Depression</div>
                          </div>
                        )}
                        {recentAssessment.stress_score && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{recentAssessment.stress_score}</div>
                            <div className="text-sm text-gray-600">Stress</div>
                          </div>
                        )}
                        {recentAssessment.overall_wellbeing_score && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {recentAssessment.overall_wellbeing_score}
                            </div>
                            <div className="text-sm text-gray-600">Wellbeing</div>
                          </div>
                        )}
                      </div>
                      <Link href="/results">
                        <Button variant="outline">View Detailed History</Button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 mb-4">Your assessment history and trends will appear here</p>
                      <Link href="/assessment">
                        <Button>Take Your First Assessment</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Health Professional Dashboard */}
          {user.role === "health_professional" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Manage your appointments</p>
                  <Link href="/appointments">
                    <Button className="w-full">View Appointments</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Patient Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">View patient assessments</p>
                  <Link href="/patients">
                    <Button variant="outline" className="w-full">
                      View Patients
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Access and manage resources</p>
                  <Link href="/resources">
                    <Button variant="outline" className="w-full">
                      Browse Resources
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Dashboard */}
          {user.role === "admin" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-gray-600">Active users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,678</div>
                  <p className="text-gray-600">Completed this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-gray-600">Scheduled this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-gray-600">Available resources</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
