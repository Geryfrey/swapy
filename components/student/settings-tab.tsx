"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { Settings, Bell, Shield, Palette, Download, Trash2, Save } from "lucide-react"

interface SettingsTabProps {
  user: User
}

export function SettingsTab({ user }: SettingsTabProps) {
  const [settings, setSettings] = useState({
    // Profile Settings
    name: user.name,
    email: user.email,
    registrationNumber: user.registrationNumber || "",

    // Notification Settings
    emailNotifications: true,
    assessmentReminders: true,
    weeklyReports: false,
    emergencyAlerts: true,

    // Privacy Settings
    shareDataForResearch: false,
    allowAnonymousAnalytics: true,

    // Appearance Settings
    theme: "light",
    language: "en",

    // Assessment Settings
    reminderFrequency: "weekly",
    autoSaveJournal: true,

    // Data Settings
    dataRetention: "1year",
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // Simulate saving settings
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportData = () => {
    // Simulate data export
    const data = {
      user: user,
      settings: settings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wellness-data-${user.registrationNumber || user.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Settings
          </CardTitle>
          <CardDescription>Manage your account preferences and privacy settings</CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
          {user.role === "student" && (
            <div>
              <Label htmlFor="regNumber">Registration Number</Label>
              <Input id="regNumber" value={settings.registrationNumber} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">Registration number cannot be changed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="assessment-reminders">Assessment Reminders</Label>
              <p className="text-sm text-gray-600">Get reminded to take regular assessments</p>
            </div>
            <Switch
              id="assessment-reminders"
              checked={settings.assessmentReminders}
              onCheckedChange={(checked) => setSettings({ ...settings, assessmentReminders: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <p className="text-sm text-gray-600">Receive weekly wellness summaries</p>
            </div>
            <Switch
              id="weekly-reports"
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
              <p className="text-sm text-gray-600">Critical mental health notifications</p>
              <Badge variant="destructive" className="text-xs mt-1">
                Required
              </Badge>
            </div>
            <Switch id="emergency-alerts" checked={settings.emergencyAlerts} disabled />
          </div>

          <div className="pt-4">
            <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
            <Select
              value={settings.reminderFrequency}
              onValueChange={(value) => setSettings({ ...settings, reminderFrequency: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Data
          </CardTitle>
          <CardDescription>Control how your data is used and shared</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="research-data">Share Data for Research</Label>
              <p className="text-sm text-gray-600">Help improve mental health services (anonymized)</p>
            </div>
            <Switch
              id="research-data"
              checked={settings.shareDataForResearch}
              onCheckedChange={(checked) => setSettings({ ...settings, shareDataForResearch: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymous-analytics">Anonymous Analytics</Label>
              <p className="text-sm text-gray-600">Help us improve the app experience</p>
            </div>
            <Switch
              id="anonymous-analytics"
              checked={settings.allowAnonymousAnalytics}
              onCheckedChange={(checked) => setSettings({ ...settings, allowAnonymousAnalytics: checked })}
            />
          </div>

          <div className="pt-4">
            <Label htmlFor="data-retention">Data Retention Period</Label>
            <Select
              value={settings.dataRetention}
              onValueChange={(value) => setSettings({ ...settings, dataRetention: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">How long to keep your assessment and journal data</p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Preferences</CardTitle>
          <CardDescription>Configure your assessment and journal settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save">Auto-save Journal Entries</Label>
              <p className="text-sm text-gray-600">Automatically save drafts while writing</p>
            </div>
            <Switch
              id="auto-save"
              checked={settings.autoSaveJournal}
              onCheckedChange={(checked) => setSettings({ ...settings, autoSaveJournal: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or delete your personal data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export My Data
            </Button>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Exporting your data will download a JSON file containing all your assessments, journal entries, and
            settings. Account deletion is permanent and cannot be undone.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saved ? "Settings Saved!" : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
