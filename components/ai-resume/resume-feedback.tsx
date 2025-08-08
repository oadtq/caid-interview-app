"use client"

import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Edit,
  Download,
  Share,
  Target,
  Type,
  Layout,
  Star,
} from "lucide-react"

interface FeedbackData {
  overallScore: number
  summary: string
  strengths: string[]
  improvements: string[]
  grammar: {
    score: number
    issues: string[]
  }
  keywords: {
    score: number
    missing: string[]
    present: string[]
  }
  formatting: {
    score: number
    issues: string[]
  }
}

interface ResumeFeedbackProps {
  feedbackData: FeedbackData | null
}

export function ResumeFeedback({ feedbackData }: ResumeFeedbackProps) {
  if (!feedbackData) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-gray-600">No feedback data available. Please upload a resume first.</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200"
    if (score >= 75) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-8">
          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-full w-20 h-20 mx-auto mb-6">
            <Award className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resume Analysis Complete</h1>
          <p className="text-gray-600 text-lg">Here's your comprehensive AI-powered resume feedback</p>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card3D>
            <div className={`rounded-xl border p-8 text-center ${getScoreBg(feedbackData.overallScore)}`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className={`text-6xl font-bold ${getScoreColor(feedbackData.overallScore)}`}>
                  {feedbackData.overallScore}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">Overall Score</div>
                  <div className="text-gray-600">Out of 100</div>
                </div>
              </div>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto">{feedbackData.summary}</p>
            </div>
          </Card3D>
        </motion.div>

        {/* Detailed Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Type className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Grammar & Language</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(feedbackData.grammar.score)}`}>
                    {feedbackData.grammar.score}/100
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {feedbackData.grammar.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Keywords</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(feedbackData.keywords.score)}`}>
                    {feedbackData.keywords.score}/100
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Present Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {feedbackData.keywords.present.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Missing Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {feedbackData.keywords.missing.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-red-100 text-red-700">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Layout className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Formatting</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(feedbackData.formatting.score)}`}>
                    {feedbackData.formatting.score}/100
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {feedbackData.formatting.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>
        </motion.div>

        {/* Strengths and Improvements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Strengths</h3>
              </div>
              <div className="space-y-3">
                {feedbackData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Areas for Improvement</h3>
              </div>
              <div className="space-y-3">
                {feedbackData.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 text-white">
            <Edit className="h-4 w-4 mr-2" />
            Edit & Improve
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Feedback
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
