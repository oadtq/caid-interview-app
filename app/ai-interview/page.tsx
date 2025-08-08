"use client"

import { useState } from "react"
import { InterviewHeader } from "@/components/ai-interview/interview-header"
import { InterviewHome } from "@/components/ai-interview/interview-home"
import { InterviewCurriculum } from "@/components/ai-interview/interview-curriculum"
import Practice from "@/components/ai-interview/practice"
import { MyVideos } from "@/components/ai-interview/my-videos"
import { QuestionSets } from "@/components/ai-interview/question-sets"
import { Certificates } from "@/components/ai-interview/certificates"

export default function AIInterviewPage() {
  const [activeTab, setActiveTab] = useState("home")

  const userInfo = {
    firstName: "Hoa",
    lastName: "Nguyen",
    email: "hoa.nguyen@vinuni.edu.vn",
    studentId: "VU2024001",
  }

  const handleLogout = () => {
    // Handle logout logic
    window.location.href = "/"
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <InterviewHome />
      case "curriculum":
        return <InterviewCurriculum />
      case "question-sets":
        return <QuestionSets />
      case "certificates":
        return <Certificates />
      case "practice":
        return <Practice />
      case "videos":
        return <MyVideos />
      default:
        return <InterviewHome />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InterviewHeader activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} userInfo={userInfo} />
      <main>{renderContent()}</main>
    </div>
  )
}
