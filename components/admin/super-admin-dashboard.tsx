"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { Users, Brain, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Building } from "lucide-react"

// Add the imports for the components we just created
import { UserManagement } from "./user-management"
import { ResourceManagement } from "./resource-management"
import { ReportsGeneration } from "./reports-generation"
import { MentalHealthOverview } from "./mental-health-overview"

interface SuperAdminDashboardProps {
  user: User
  onLogout: () => void
}

export function SuperAdminDashboard({ user, onLogout }: SuperAdminDashboardProps) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    criticalCases: 0,
    activeCenters: 0,
    totalResources: 0,
    weeklyGrowth: 0,
  })

  // Load dashboard statistics
  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalStudents: 1247,
      totalAssessments: 3891,
      criticalCases: 23,
      activeCenters: 12,
      totalResources: 156,
      weeklyGrowth: 8.5,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Mental Health Wellness System</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Super Admin
              </Badge>
              <Button variant="outline" onClick={onLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="mental-health">Mental Health Status</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                      <p className="text-2xl font-bold">{stats.totalAssessments.toLocaleString()}</p>
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
                      <p className="text-2xl font-bold text-red-600">{stats.criticalCases}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Centers</p>
                      <p className="text-2xl font-bold">{stats.activeCenters}</p>
                    </div>
                    <Building className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resources</p>
                      <p className="text-2xl font-bold">{stats.totalResources}</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Weekly Growth</p>
                      <p className="text-2xl font-bold text-green-600">+{stats.weeklyGrowth}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Critical Cases</CardTitle>
                  <CardDescription>Students requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "220014748", name: "John D.", risk: "Critical", time: "2 hours ago" },
                      { id: "220015892", name: "Sarah M.", risk: "Critical", time: "4 hours ago" },
                      { id: "220016743", name: "Mike R.", risk: "Critical", time: "6 hours ago" },
                    ].map((case_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">{case_.name}</p>
                          <p className="text-sm text-gray-600">ID: {case_.id}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">{case_.risk}</Badge>
                          <p className="text-xs text-gray-500 mt-1">{case_.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Overall system performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Assessment Completion Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response Time</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">&lt; 2s</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">System Uptime</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">99.9%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Processing</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Processing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="resources">
            <ResourceManagement />
          </TabsContent>

          <TabsContent value="mental-health">
            <MentalHealthOverview />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsGeneration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
