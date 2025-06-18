"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { AlertTriangle, TrendingUp, Users, Brain } from "lucide-react"

export function MentalHealthOverview() {
  // Mock data for mental health overview
  const riskDistribution = [
    { risk: "Low", count: 892, fill: "#10b981" },
    { risk: "Moderate", count: 332, fill: "#f59e0b" },
    { risk: "Critical", count: 23, fill: "#ef4444" },
  ]

  const conditionFrequency = [
    { condition: "Academic Stress", count: 456 },
    { condition: "Anxiety", count: 234 },
    { condition: "Depression", count: 123 },
    { condition: "Sleep Issues", count: 89 },
    { condition: "Social Anxiety", count: 67 },
  ]

  const weeklyTrends = [
    { week: "Week 1", critical: 18, moderate: 298, low: 834 },
    { week: "Week 2", critical: 21, moderate: 312, low: 867 },
    { week: "Week 3", critical: 25, moderate: 334, low: 891 },
    { week: "Week 4", critical: 23, moderate: 332, low: 892 },
  ]

  const criticalCases = [
    {
      id: "220014748",
      name: "John D.",
      conditions: ["Severe Anxiety", "Academic Stress"],
      riskLevel: "Critical",
      lastAssessment: "2 hours ago",
      status: "Contacted",
    },
    {
      id: "220015892",
      name: "Sarah M.",
      conditions: ["Depression", "Sleep Issues"],
      riskLevel: "Critical",
      lastAssessment: "4 hours ago",
      status: "Pending",
    },
    {
      id: "220016743",
      name: "Mike R.",
      conditions: ["Panic Disorder", "Social Anxiety"],
      riskLevel: "Critical",
      lastAssessment: "6 hours ago",
      status: "In Progress",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Contacted":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-green-600">+5.2% from last month</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assessments This Week</p>
                <p className="text-2xl font-bold">387</p>
                <p className="text-xs text-green-600">+12.3% from last week</p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Cases</p>
                <p className="text-2xl font-bold text-red-600">23</p>
                <p className="text-xs text-red-600">+2 from yesterday</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Improvement Rate</p>
                <p className="text-2xl font-bold text-green-600">78%</p>
                <p className="text-xs text-green-600">+3.1% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Current distribution of student risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                low: { label: "Low Risk", color: "#10b981" },
                moderate: { label: "Moderate Risk", color: "#f59e0b" },
                critical: { label: "Critical Risk", color: "#ef4444" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ risk, count }) => `${risk}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Mental Health Conditions</CardTitle>
            <CardDescription>Most frequently identified conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Frequency",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conditionFrequency} layout="horizontal">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Risk Trends</CardTitle>
          <CardDescription>Risk level trends over the past 4 weeks</CardDescription>
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
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="critical" stroke="var(--color-critical)" strokeWidth={2} />
                <Line type="monotone" dataKey="moderate" stroke="var(--color-moderate)" strokeWidth={2} />
                <Line type="monotone" dataKey="low" stroke="var(--color-low)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Critical Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Critical Cases Requiring Immediate Attention
          </CardTitle>
          <CardDescription>Students with critical risk levels that need immediate intervention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalCases.map((case_, index) => (
              <div key={index} className="border rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{case_.name}</h4>
                      <Badge variant="destructive">{case_.riskLevel}</Badge>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {case_.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Student ID: {case_.id}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {case_.conditions.map((condition, conditionIndex) => (
                        <Badge key={conditionIndex} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Last assessment: {case_.lastAssessment}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Contact
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                      View Details
                    </button>
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
