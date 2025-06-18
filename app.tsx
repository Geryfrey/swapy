"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { LoginForm } from "@/components/auth/login-form"
import { StudentDashboard } from "@/components/student/student-dashboard"
import { SuperAdminDashboard } from "@/components/admin/super-admin-dashboard"

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("wellness-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    localStorage.setItem("wellness-user", JSON.stringify(loggedInUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("wellness-user")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  switch (user.role) {
    case "student":
      return <StudentDashboard user={user} onLogout={handleLogout} />
    case "super_admin":
      return <SuperAdminDashboard user={user} onLogout={handleLogout} />
    default:
      return <StudentDashboard user={user} onLogout={handleLogout} />
  }
}
