"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Report } from "@/lib/types"
import { Download, FileText, CalendarIcon, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

export function ReportsGeneration() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock reports data
  const [reports] = useState<Report[]>([
    {
      id: "1",
      type: "monthly",
      period: "November 2024",
      data: {
        totalAssessments: 387,
        riskDistribution: { low: 892, moderate: 332, critical: 23 },
        commonConditions: { "Academic Stress": 456, Anxiety: 234, Depression: 123 },
        sentimentAnalysis: { positive: 234, neutral: 567, negative: 446 },
        trends: [],
      },
      generatedAt: new Date("2024-12-01"),
    },
    {
      id: "2",
      type: "weekly",
      period: "Week 48, 2024",
      data: {
        totalAssessments: 89,
        riskDistribution: { low: 201, moderate: 78, critical: 6 },
        commonConditions: { "Academic Stress": 102, Anxiety: 56, Depression: 23 },
        sentimentAnalysis: { positive: 67, neutral: 134, negative: 84 },
        trends: [],
      },
      generatedAt: new Date("2024-11-30"),
    },
    {
      id: "3",
      type: "quarterly",
      period: "Q4 2024",
      data: {
        totalAssessments: 1156,
        riskDistribution: { low: 2678, moderate: 998, critical: 67 },
        commonConditions: { "Academic Stress": 1367, Anxiety: 702, Depression: 389 },
        sentimentAnalysis: { positive: 701, neutral: 1702, negative: 1340 },
        trends: [],
      },
      generatedAt: new Date("2024-12-01"),
    },
  ])

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)

    // In a real app, this would generate and download the report
    const reportData = {
      period: selectedPeriod,
      date: selectedDate,
      generatedAt: new Date(),
      data: {
        totalAssessments: Math.floor(Math.random() * 500) + 100,
        riskDistribution: {
          low: Math.floor(Math.random() * 800) + 200,
          moderate: Math.floor(Math.random() * 300) + 50,
          critical: Math.floor(Math.random() * 50) + 5,
        },
      },
    }

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mental-health-report-${selectedPeriod}-${format(selectedDate, "yyyy-MM-dd")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getReportTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      weekly: "bg-blue-100 text-blue-800",
      monthly: "bg-green-100 text-green-800",
      quarterly: "bg-purple-100 text-purple-800",
      yearly: "bg-orange-100 text-orange-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports Generation
          </CardTitle>
          <CardDescription>Generate and download comprehensive mental health reports</CardDescription>
        </CardHeader>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Create a comprehensive report for the specified period</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Preview of what will be included in the generated report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">3,891</p>
              <p className="text-sm text-gray-600">Assessments</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">23</p>
              <p className="text-sm text-gray-600">Critical Cases</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-gray-600">Improvement Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Reports</CardTitle>
          <CardDescription>Download previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total Assessments</TableHead>
                <TableHead>Critical Cases</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.period}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </TableCell>
                  <TableCell>{report.data.totalAssessments.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="text-red-600 font-medium">{report.data.riskDistribution.critical}</span>
                  </TableCell>
                  <TableCell>{new Date(report.generatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Important trends and patterns from recent reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Positive Trend</h4>
              <p className="text-sm text-green-700">
                Overall mental health scores have improved by 12% compared to the previous quarter, indicating effective
                intervention strategies.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Area of Concern</h4>
              <p className="text-sm text-yellow-700">
                Academic stress remains the most common condition, affecting 36% of students. Consider implementing
                additional stress management resources.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Recommendation</h4>
              <p className="text-sm text-blue-700">
                Increase outreach during exam periods when critical cases typically spike by 40%. Early intervention
                programs show promising results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
