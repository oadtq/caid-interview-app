"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ResumeHeader } from "@/components/ai-resume/resume-header"
import { ResumeHome } from "@/components/ai-resume/resume-home"
import { ResumeAI } from "@/components/ai-resume/resume-ai"
import { MyScans } from "@/components/ai-resume/my-scans"
import { ResumeCurriculum } from "@/components/ai-resume/resume-curriculum"
import { ResumeTemplates } from "@/components/ai-resume/resume-templates"
import { GenerateCoverLetter } from "@/components/ai-resume/generate-cover-letter"
import { MyCoverLetters } from "@/components/ai-resume/my-cover-letters"
import { ResumeBuilder } from "@/components/ai-resume/resume-builder"
import { motion, AnimatePresence } from "framer-motion"

export default function AIResumePage() {
  const [activeTab, setActiveTab] = useState("home")
  const searchParams = useSearchParams()

  // Read URL parameters and set initial tab
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const userInfo = {
    firstName: "John",
    lastName: "Doe",
    studentId: "STU2024001",
    email: "john.doe@vinuni.edu.vn",
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <ResumeHome onGetStarted={() => setActiveTab("resume-ai")} />
      case "resume-ai":
        return <ResumeAI setActiveTab={setActiveTab} />
      case "my-scans":
        return <MyScans />
      case "curriculum":
        return <ResumeCurriculum />
      case "templates":
        return <ResumeTemplates />
      case "generate-cover-letter":
        return <GenerateCoverLetter setActiveTab={setActiveTab} />
      case "my-cover-letters":
        return <MyCoverLetters setActiveTab={setActiveTab} />
      case "resume-builder":
        return <ResumeBuilder />
      default:
        return <ResumeHome onGetStarted={() => setActiveTab("resume-ai")} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeHeader activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} userInfo={userInfo} />

      <main className="pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
