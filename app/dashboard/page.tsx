"use client"

import { useState } from "react"
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

export default function DashboardPage() {
  const [user] = useState<User>({
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

  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={handleLogout} userInfo={user} />
      <FeatureSelectionDashboard />
    </div>
  )
} 