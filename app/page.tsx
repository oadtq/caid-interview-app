"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FeatureSelectionDashboard } from "@/components/dashboard/feature-selection-dashboard"

interface User {
  firstName: string
  lastName: string
  studentId: string
  email: string
  degreeProgram: string
  academicYear: string
  major: string
  minor: string
  mentoringAreas: string[]
  biography: string
  cvFile?: File
}

export default function StudentPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User>({
    firstName: "John",
    lastName: "Doe",
    studentId: "STU2024001",
    email: "john.doe@university.edu",
    degreeProgram: "",
    academicYear: "",
    major: "",
    minor: "",
    mentoringAreas: [],
    biography: "",
  })

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Simulate authentication
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={handleLogout} userInfo={user} />
      <FeatureSelectionDashboard />
    </div>
  )
}
