"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface UserProfile {
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

interface SubmitRequestTabProps {
  profileData: UserProfile
  onRequestSubmit: (request: any) => void
}

export function SubmitRequestTab({ profileData, onRequestSubmit }: SubmitRequestTabProps) {
  const [formData, setFormData] = useState({
    goal: "",
    preferredMentor: "",
    timeline: "",
    sessionFrequency: "",
    mentoringProgram: "", // Add this new field
    specificAreas: [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const mentoringAreas = [
    "Career Guidance",
    "Technical Skills",
    "Industry Insights",
    "Networking",
    "Interview Preparation",
    "Research Guidance",
    "Entrepreneurship",
    "Leadership Development",
  ]

  const mentoringPrograms = [
    "Career Development Program",
    "Technical Skills Mentorship",
    "Industry Transition Program",
    "Leadership Development Track",
    "Entrepreneurship Mentorship",
    "Research & Academia Program",
    "Interview Preparation Program",
    "Networking & Professional Growth",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newRequest = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date(),
      status: "pending" as const,
    }

    onRequestSubmit(newRequest)
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        goal: "",
        preferredMentor: "",
        timeline: "",
        sessionFrequency: "",
        mentoringProgram: "", // Add this line
        specificAreas: [],
      })
    }, 3000)
  }

  const handleAreaToggle = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      specificAreas: prev.specificAreas.includes(area)
        ? prev.specificAreas.filter((a) => a !== area)
        : [...prev.specificAreas, area],
    }))
  }

  if (isSubmitted) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Request Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your mentoring request has been submitted. Our AI system will analyze your profile and find the best match.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• AI analysis of your profile and goals</li>
              <li>• Mentor matching based on expertise</li>
              <li>• Notification within 2-3 business days</li>
              <li>• Direct connection with your mentor</li>
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-gray-900 mb-2">Submit Mentoring Request</h1>
        <p className="text-gray-600 font-light">Tell us about your goals and we'll find the perfect mentor for you</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mentoring Goal */}
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm font-medium text-gray-700">
                  What do you hope to achieve through mentoring? *
                </Label>
                <Textarea
                  id="goal"
                  placeholder="Describe your goals, challenges, or specific areas where you'd like guidance..."
                  value={formData.goal}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goal: e.target.value }))}
                  className="min-h-[120px] resize-none"
                  required
                />
                <p className="text-xs text-gray-500">Be specific about what you want to learn or achieve</p>
              </div>

              {/* Preferred Mentor */}
              <div className="space-y-2">
                <Label htmlFor="preferredMentor" className="text-sm font-medium text-gray-700">
                  Preferred Mentor Type (Optional)
                </Label>
                <Input
                  id="preferredMentor"
                  placeholder="e.g., Senior Software Engineer at Google, Product Manager with startup experience..."
                  value={formData.preferredMentor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferredMentor: e.target.value }))}
                />
              </div>

              {/* Mentoring Program */}
              <div className="space-y-2">
                <Label htmlFor="mentoringProgram" className="text-sm font-medium text-gray-700">
                  Mentoring Program *
                </Label>
                <Select
                  value={formData.mentoringProgram}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, mentoringProgram: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the mentoring program you're applying for" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentoringPrograms.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Choose the program that best aligns with your goals</p>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-sm font-medium text-gray-700">
                  Expected Timeline *
                </Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, timeline: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How long do you expect this mentoring relationship to last?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="12+ months">12+ months</SelectItem>
                    <SelectItem value="ongoing">Ongoing relationship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Session Frequency */}
              <div className="space-y-2">
                <Label htmlFor="sessionFrequency" className="text-sm font-medium text-gray-700">
                  Preferred Session Frequency *
                </Label>
                <Select
                  value={formData.sessionFrequency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, sessionFrequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How often would you like to meet?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="as-needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Areas */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Areas of Focus (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {mentoringAreas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={area}
                        checked={formData.specificAreas.includes(area)}
                        onChange={() => handleAreaToggle(area)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={area} className="text-sm text-gray-700 cursor-pointer">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.goal ||
                    !formData.timeline ||
                    !formData.sessionFrequency ||
                    !formData.mentoringProgram
                  }
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Mentoring Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Profile Summary Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-24"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                {/* Placeholder for User icon */}
                Your Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Name</h4>
                <p className="text-sm text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Student ID</h4>
                <p className="text-sm text-gray-900">{profileData.studentId}</p>
              </div>

              {profileData.degreeProgram && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Degree Program</h4>
                  <p className="text-sm text-gray-900">{profileData.degreeProgram}</p>
                </div>
              )}

              {profileData.major && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Major</h4>
                  <p className="text-sm text-gray-900">{profileData.major}</p>
                </div>
              )}

              {profileData.mentoringAreas.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-1">
                    {profileData.mentoringAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Profile ready for matching
                </div>
              </div>
            </CardContent>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
