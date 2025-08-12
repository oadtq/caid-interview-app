"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"

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

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/dashboard"
    }
  }, [isAuthenticated])

  return <LoginForm onLogin={handleLogin} />
}
