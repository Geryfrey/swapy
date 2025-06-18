"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User, Assessment, Resource } from "@/lib/types"
import { AssessmentForm } from "./assessment-form"
import { ResultsVisualization } from "./results-visualization"
import { JournalTab } from "./journal-tab"
import { SettingsTab } from "./settings-tab"
import { ResourceViewer } from "./resource-viewer"
import { MentalHealthCenterCard } from "./mental-health-center-card"
import { Brain, Heart, TrendingUp, BookOpen, Settings, PenTool, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface StudentDashboardProps {
  user: User
  onLogout: () => void
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [showAssessment, setShowAssessment] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  // Load existing assessments (simulated)
  useEffect(() => {
    const mockAssessments: Assessment[] = [
      {
        id: "1",
        studentId: user.id,
        responses: { stress: 8, anxiety: 7, sleep: 5 },
        predictions: {
          conditions: ["Academic Stress", "Anxiety"],
          riskLevel: "moderate",
          sentiment: "negative",
          confidence: 0.85,
        },
        recommendations: {
          resources: [],
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ]
    setAssessments(mockAssessments)
  }, [user.id])

  const latestAssessment = assessments[0]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "destructive"
      case "moderate":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      case "neutral":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mental Health Wellness</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Assessment
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              My Results
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                      <p className="text-2xl font-bold">{assessments.length}</p>
                    </div>
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Current Risk Level</p>
                      <Badge variant={getRiskColor(latestAssessment?.predictions.riskLevel || "low")}>
                        {latestAssessment?.predictions.riskLevel || "Not assessed"}
                      </Badge>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Wellness Score</p>
                      <p className="text-2xl font-bold">
                        {latestAssessment ? Math.round(latestAssessment.predictions.confidence * 100) : "N/A"}%
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Assessment</p>
                      <p className="text-sm">
                        {latestAssessment ? new Date(latestAssessment.createdAt).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest Assessment Results */}
            {latestAssessment && (
              <Card>
                <CardHeader>
                  <CardTitle>Latest Assessment Results</CardTitle>
                  <CardDescription>
                    Completed on {new Date(latestAssessment.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Predicted Conditions</h4>
                      <div className="flex flex-wrap gap-2">
                        {latestAssessment.predictions.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Risk Level</h4>
                      <Badge variant={getRiskColor(latestAssessment.predictions.riskLevel)}>
                        {latestAssessment.predictions.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Sentiment</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(latestAssessment.predictions.sentiment)}`}
                      >
                        {latestAssessment.predictions.sentiment.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {latestAssessment.predictions.riskLevel === "critical" &&
                    latestAssessment.recommendations.centers && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Immediate Support Recommended:</strong> Based on your assessment, we recommend
                          contacting one of these mental health centers immediately.
                        </AlertDescription>
                      </Alert>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {latestAssessment?.recommendations && (
              <div className="space-y-6">
                {latestAssessment.recommendations.centers && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Immediate Support Centers
                      </CardTitle>
                      <CardDescription>
                        Professional help is available. Contact these centers for immediate support.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {latestAssessment.recommendations.centers.map((center) => (
                          <MentalHealthCenterCard key={center.id} center={center} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Recommended Resources
                    </CardTitle>
                    <CardDescription>
                      Educational materials and self-help resources tailored to your needs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {latestAssessment.recommendations.resources.map((resource) => (
                        <Card
                          key={resource.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedResource(resource)}
                        >
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">{resource.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{resource.summary}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{resource.type}</Badge>
                              <span className="text-xs text-gray-500">{resource.readTime} min read</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => setActiveTab("assessment")}>Take New Assessment</Button>
                  <Button variant="outline" onClick={() => setActiveTab("journal")}>
                    Write in Journal
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("results")}>
                    View Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment">
            <AssessmentForm
              user={user}
              onComplete={(assessment) => {
                setAssessments([assessment, ...assessments])
                setActiveTab("dashboard")
              }}
            />
          </TabsContent>

          <TabsContent value="results">
            <ResultsVisualization assessments={assessments} />
          </TabsContent>

          <TabsContent value="journal">
            <JournalTab user={user} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab user={user} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Resource Viewer Modal */}
      {selectedResource && <ResourceViewer resource={selectedResource} onClose={() => setSelectedResource(null)} />}
    </div>
  )
}
