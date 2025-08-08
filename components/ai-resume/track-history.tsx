"use client"

import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Calendar, BarChart3, ArrowUp } from "lucide-react"

export function TrackHistory() {
  const resumeHistory = [
    {
      id: "1",
      name: "Resume_v3.pdf",
      uploadDate: "2024-01-15",
      overallScore: 92,
      grammarScore: 95,
      keywordScore: 88,
      formattingScore: 94,
      status: "Latest",
      improvements: ["+5 Grammar", "+12 Keywords", "+8 Formatting"],
    },
    {
      id: "2",
      name: "Resume_v2.pdf",
      uploadDate: "2024-01-10",
      overallScore: 85,
      grammarScore: 90,
      keywordScore: 76,
      formattingScore: 86,
      status: "Previous",
      improvements: ["+8 Grammar", "+3 Keywords", "+12 Formatting"],
    },
    {
      id: "3",
      name: "Resume_v1.pdf",
      uploadDate: "2024-01-05",
      overallScore: 72,
      grammarScore: 82,
      keywordScore: 73,
      formattingScore: 74,
      status: "Original",
      improvements: [],
    },
  ]

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Scans</h1>
          <p className="text-gray-600 text-lg">Review your resume scan history and track improvements</p>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card3D>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">3</div>
                  <div className="text-green-100">Total Uploads</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold mb-2">
                    +20
                    <ArrowUp className="h-6 w-6" />
                  </div>
                  <div className="text-green-100">Score Improvement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">92</div>
                  <div className="text-green-100">Current Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">15</div>
                  <div className="text-green-100">Days Active</div>
                </div>
              </div>
            </div>
          </Card3D>
        </motion.div>

        {/* Resume History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Versions</h2>

          {resumeHistory.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card3D>
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{resume.name}</h3>
                          <Badge
                            variant={resume.status === "Latest" ? "default" : "secondary"}
                            className={resume.status === "Latest" ? "bg-green-100 text-green-700" : ""}
                          >
                            {resume.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>Uploaded on {formatDate(resume.uploadDate)}</span>
                        </div>
                        {resume.improvements.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {resume.improvements.map((improvement, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {improvement}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {resume.status === "Latest" && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-3 rounded-lg border text-center ${getScoreBg(resume.overallScore)}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(resume.overallScore)}`}>
                        {resume.overallScore}
                      </div>
                      <div className="text-xs text-gray-600">Overall</div>
                    </div>
                    <div className={`p-3 rounded-lg border text-center ${getScoreBg(resume.grammarScore)}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(resume.grammarScore)}`}>
                        {resume.grammarScore}
                      </div>
                      <div className="text-xs text-gray-600">Grammar</div>
                    </div>
                    <div className={`p-3 rounded-lg border text-center ${getScoreBg(resume.keywordScore)}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(resume.keywordScore)}`}>
                        {resume.keywordScore}
                      </div>
                      <div className="text-xs text-gray-600">Keywords</div>
                    </div>
                    <div className={`p-3 rounded-lg border text-center ${getScoreBg(resume.formattingScore)}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(resume.formattingScore)}`}>
                        {resume.formattingScore}
                      </div>
                      <div className="text-xs text-gray-600">Formatting</div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Progress Analytics</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">+20</div>
                  <div className="text-gray-600">Overall Score Improvement</div>
                  <div className="text-sm text-gray-500">From 72 to 92</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">+15</div>
                  <div className="text-gray-600">Keywords Added</div>
                  <div className="text-sm text-gray-500">Better ATS compatibility</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">+20</div>
                  <div className="text-gray-600">Formatting Score</div>
                  <div className="text-sm text-gray-500">Professional appearance</div>
                </div>
              </div>
            </div>
          </Card3D>
        </motion.div>
      </motion.div>
    </div>
  )
}
