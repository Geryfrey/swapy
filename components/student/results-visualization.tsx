"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { Assessment } from "@/lib/types"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ResultsVisualizationProps {
  assessments: Assessment[]
}

export function ResultsVisualization({ assessments }: ResultsVisualizationProps) {
  // Generate trend data from assessments
  const trendData = assessments
    .map((assessment, index) => ({
      date: new Date(assessment.createdAt).toLocaleDateString(),
      stressLevel: assessment.responses.stress_level || 0,
      anxietyLevel: assessment.responses.anxiety_level || 0,
      sleepHours: assessment.responses.sleep_quality || 0,
      riskScore:
        assessment.predictions.riskLevel === "critical" ? 3 : assessment.predictions.riskLevel === "moderate" ? 2 : 1,
      confidenceScore: Math.round(assessment.predictions.confidence * 100),
    }))
    .reverse()

  // Risk level distribution
  const riskDistribution = assessments.reduce(
    (acc, assessment) => {
      const risk = assessment.predictions.riskLevel
      acc[risk] = (acc[risk] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const riskChartData = Object.entries(riskDistribution).map(([risk, count]) => ({
    risk: risk.charAt(0).toUpperCase() + risk.slice(1),
    count,
    fill: risk === "critical" ? "#ef4444" : risk === "moderate" ? "#f59e0b" : "#10b981",
  }))

  // Condition frequency
  const conditionFrequency = assessments.reduce(
    (acc, assessment) => {
      assessment.predictions.conditions.forEach((condition) => {
        acc[condition] = (acc[condition] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const conditionChartData = Object.entries(conditionFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([condition, count]) => ({
      condition: condition.length > 15 ? condition.substring(0, 15) + "..." : condition,
      count,
    }))

  // Sentiment analysis over time
  const sentimentData = assessments
    .map((assessment, index) => ({
      date: new Date(assessment.createdAt).toLocaleDateString(),
      sentiment:
        assessment.predictions.sentiment === "positive" ? 1 : assessment.predictions.sentiment === "neutral" ? 0 : -1,
    }))
    .reverse()

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const latestAssessment = assessments[0]
  const previousAssessment = assessments[1]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stress Level</p>
                <p className="text-2xl font-bold">{latestAssessment?.responses.stress_level || "N/A"}</p>
              </div>
              {previousAssessment &&
                getTrendIcon(
                  latestAssessment?.responses.stress_level || 0,
                  previousAssessment?.responses.stress_level || 0,
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Anxiety Level</p>
                <p className="text-2xl font-bold">{latestAssessment?.responses.anxiety_level || "N/A"}</p>
              </div>
              {previousAssessment &&
                getTrendIcon(
                  latestAssessment?.responses.anxiety_level || 0,
                  previousAssessment?.responses.anxiety_level || 0,
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Sleep Hours</p>
              <p className="text-2xl font-bold">{latestAssessment?.responses.sleep_quality || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Risk Level</p>
              <Badge
                variant={
                  latestAssessment?.predictions.riskLevel === "critical"
                    ? "destructive"
                    : latestAssessment?.predictions.riskLevel === "moderate"
                      ? "default"
                      : "secondary"
                }
              >
                {latestAssessment?.predictions.riskLevel || "Unknown"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stress & Anxiety Trends</CardTitle>
            <CardDescription>Your stress and anxiety levels over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                stressLevel: {
                  label: "Stress Level",
                  color: "hsl(var(--chart-1))",
                },
                anxietyLevel: {
                  label: "Anxiety Level",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="stressLevel"
                    stroke="var(--color-stressLevel)"
                    strokeWidth={2}
                    name="Stress Level"
                  />
                  <Line
                    type="monotone"
                    dataKey="anxietyLevel"
                    stroke="var(--color-anxietyLevel)"
                    strokeWidth={2}
                    name="Anxiety Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Distribution of your risk assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                critical: { label: "Critical", color: "#ef4444" },
                moderate: { label: "Moderate", color: "#f59e0b" },
                low: { label: "Low", color: "#10b981" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ risk, count }) => `${risk}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {riskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Common Conditions</CardTitle>
            <CardDescription>Most frequently identified conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Frequency",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conditionChartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="condition" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>Your emotional sentiment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sentiment: {
                  label: "Sentiment",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    domain={[-1, 1]}
                    tickFormatter={(value) => (value === 1 ? "Positive" : value === 0 ? "Neutral" : "Negative")}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => `Date: ${value}`}
                    formatter={(value: number) => [
                      value === 1 ? "Positive" : value === 0 ? "Neutral" : "Negative",
                      "Sentiment",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="var(--color-sentiment)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Assessment History */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>Detailed view of your past assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{new Date(assessment.createdAt).toLocaleDateString()}</span>
                  <Badge
                    variant={
                      assessment.predictions.riskLevel === "critical"
                        ? "destructive"
                        : assessment.predictions.riskLevel === "moderate"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {assessment.predictions.riskLevel}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Stress:</span> {assessment.responses.stress_level}/10
                  </div>
                  <div>
                    <span className="text-gray-600">Anxiety:</span> {assessment.responses.anxiety_level}/10
                  </div>
                  <div>
                    <span className="text-gray-600">Sleep:</span> {assessment.responses.sleep_quality}h
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>{" "}
                    {Math.round(assessment.predictions.confidence * 100)}%
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">Conditions: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assessment.predictions.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
