"use client"

import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { FileText, Calendar, Download, Eye, Trash2, ArrowLeft, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Target, Type, Layout, Shield } from 'lucide-react'

interface ScanData {
  id: string
  fileName: string
  jobTitle: string
  company: string
  scanDate: string
  overallScore: number
  status: "completed" | "processing" | "failed"
  feedback: {
    readability: {
      score: number
      metCriteria: number
      totalCriteria: number
      issues: Array<{
        name: string
        status: "error" | "warning" | "success"
        details: string
        recommendations: string[]
      }>
    }
    credibility: {
      score: number
      metCriteria: number
      totalCriteria: number
      issues: Array<{
        name: string
        status: "error" | "warning" | "success"
        details: string
        recommendations: string[]
      }>
    }
    atsfit: {
      score: number
      metCriteria: number
      totalCriteria: number
      issues: Array<{
        name: string
        status: "error" | "warning" | "success"
        details: string
        recommendations: string[]
      }>
    }
    format: {
      score: number
      metCriteria: number
      totalCriteria: number
      issues: Array<{
        name: string
        status: "error" | "warning" | "success"
        details: string
        recommendations: string[]
      }>
    }
  }
}

export function MyScans() {
  const [selectedScan, setSelectedScan] = useState<ScanData | null>(null)
  const [activeTab, setActiveTab] = useState<"readability" | "credibility" | "atsfit" | "format">("readability")
  const [expandedCriteria, setExpandedCriteria] = useState<string[]>([])

  // Demo scan data
  const scanHistory: ScanData[] = [
    {
      id: "1",
      fileName: "John_Doe_Resume.pdf",
      jobTitle: "Software Engineer",
      company: "Google",
      scanDate: "2024-01-15",
      overallScore: 85,
      status: "completed",
      feedback: {
        readability: {
          score: 88,
          metCriteria: 2,
          totalCriteria: 4,
          issues: [
            {
              name: "Summary Statement",
              status: "error",
              details: "Your summary statement needs improvement to better highlight your key qualifications.",
              recommendations: [
                "Include 2-3 key achievements with quantifiable results",
                "Mention your years of experience and primary expertise",
                "Align the summary with the target job requirements"
              ]
            },
            {
              name: "Spelling & Grammar",
              status: "warning",
              details: "Minor spelling and grammar issues detected that could impact readability.",
              recommendations: [
                "Use spell-check tools before submitting",
                "Have someone proofread your resume",
                "Pay attention to consistent verb tenses"
              ]
            },
            {
              name: "Contact Information",
              status: "success",
              details: "Perfect! You have included all of the required contact information details in your resume.",
              recommendations: [
                "Email", "Full Name", "City / State", "Phone Number", "LinkedIn Page"
              ]
            },
            {
              name: "Sections",
              status: "success",
              details: "Your resume sections are well-organized and follow standard formatting.",
              recommendations: [
                "Maintain consistent section headers",
                "Keep sections in logical order",
                "Use clear section dividers"
              ]
            }
          ]
        },
        credibility: {
          score: 92,
          metCriteria: 5,
          totalCriteria: 6,
          issues: [
            {
              name: "Experience Chronological Order",
              status: "error",
              details: "Your work experience should be listed in reverse chronological order.",
              recommendations: [
                "List most recent position first",
                "Ensure dates are accurate and consistent",
                "Include month and year for each position"
              ]
            },
            {
              name: "Quantified Achievements",
              status: "success",
              details: "Excellent use of numbers and metrics to demonstrate impact.",
              recommendations: []
            },
            {
              name: "Action Verbs",
              status: "success",
              details: "Strong use of action verbs throughout your experience descriptions.",
              recommendations: []
            }
          ]
        },
        atsfit: {
          score: 78,
          metCriteria: 4,
          totalCriteria: 6,
          issues: [
            {
              name: "Keyword Matching",
              status: "warning",
              details: "Your resume could benefit from more relevant keywords from the job description.",
              recommendations: [
                "Include more technical skills mentioned in job posting",
                "Use industry-specific terminology",
                "Match job title keywords where appropriate"
              ]
            },
            {
              name: "Job Title Match",
              status: "error",
              details: "Your current job titles don't closely match the target position.",
              recommendations: [
                "Consider adjusting job titles to be more relevant",
                "Highlight transferable skills",
                "Use keywords from target job description"
              ]
            }
          ]
        },
        format: {
          score: 82,
          metCriteria: 3,
          totalCriteria: 6,
          issues: [
            {
              name: "Font Size & Choice",
              status: "error",
              details: "Font size and choice could be improved for better readability.",
              recommendations: [
                "Use 10-12pt font size for body text",
                "Choose professional fonts like Arial, Calibri, or Times New Roman",
                "Ensure consistent font usage throughout"
              ]
            },
            {
              name: "Line Spacing",
              status: "error",
              details: "Line spacing needs adjustment for optimal readability.",
              recommendations: [
                "Use 1.15-1.5 line spacing",
                "Ensure consistent spacing between sections",
                "Add appropriate white space around content"
              ]
            },
            {
              name: "Date Format",
              status: "error",
              details: "Date formatting is inconsistent throughout the resume.",
              recommendations: [
                "Use consistent date format (MM/YYYY or Month YYYY)",
                "Align dates consistently",
                "Include present for current positions"
              ]
            }
          ]
        }
      }
    },
    {
      id: "2",
      fileName: "Jane_Smith_Resume.pdf",
      jobTitle: "Product Manager",
      company: "Microsoft",
      scanDate: "2024-01-10",
      overallScore: 92,
      status: "completed",
      feedback: {
        readability: {
          score: 95,
          metCriteria: 4,
          totalCriteria: 4,
          issues: []
        },
        credibility: {
          score: 90,
          metCriteria: 5,
          totalCriteria: 6,
          issues: []
        },
        atsfit: {
          score: 88,
          metCriteria: 5,
          totalCriteria: 6,
          issues: []
        },
        format: {
          score: 95,
          metCriteria: 6,
          totalCriteria: 6,
          issues: []
        }
      }
    },
    {
      id: "3",
      fileName: "Alex_Johnson_Resume.pdf",
      jobTitle: "Data Scientist",
      company: "Meta",
      scanDate: "2024-01-05",
      overallScore: 76,
      status: "completed",
      feedback: {
        readability: {
          score: 72,
          metCriteria: 2,
          totalCriteria: 4,
          issues: []
        },
        credibility: {
          score: 85,
          metCriteria: 4,
          totalCriteria: 6,
          issues: []
        },
        atsfit: {
          score: 70,
          metCriteria: 3,
          totalCriteria: 6,
          issues: []
        },
        format: {
          score: 78,
          metCriteria: 4,
          totalCriteria: 6,
          issues: []
        }
      }
    }
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

  const handleDelete = (scanId: string) => {
    // Handle delete logic
    console.log("Delete scan:", scanId)
  }

  const toggleCriteriaExpansion = (criteriaName: string) => {
    setExpandedCriteria(prev => 
      prev.includes(criteriaName) 
        ? prev.filter(name => name !== criteriaName)
        : [...prev, criteriaName]
    )
  }

  const getStatusIcon = (status: "error" | "warning" | "success") => {
    switch (status) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "readability":
        return <Type className="h-5 w-5" />
      case "credibility":
        return <Shield className="h-5 w-5" />
      case "atsfit":
        return <Target className="h-5 w-5" />
      case "format":
        return <Layout className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "readability":
        return "Readability is defined as the ease of scanning and understanding a resume."
      case "credibility":
        return "Credibility is defined by effective use of action words, keywords, and language."
      case "atsfit":
        return "ATS Fit is defined by how well resume matches job description."
      case "format":
        return "Format is defined by how well organized your resume is."
      default:
        return ""
    }
  }

  if (selectedScan) {
    const currentFeedback = selectedScan.feedback[activeTab]
    
    return (
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedScan(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Scans
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedScan.fileName}</h1>
            <p className="text-gray-600">{selectedScan.jobTitle} at {selectedScan.company}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {[
            { key: "readability", label: "READABILITY", icon: "📖" },
            { key: "credibility", label: "CREDIBILITY", icon: "⚡" },
            { key: "atsfit", label: "ATS FIT", icon: "🎯" },
            { key: "format", label: "FORMAT", icon: "📄" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Action Items */}
          <div className="lg:col-span-1">
            <Card3D>
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Action Items</h3>
                <div className="space-y-3">
                  {currentFeedback.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        expandedCriteria.includes(issue.name)
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleCriteriaExpansion(issue.name)}
                    >
                      {getStatusIcon(issue.status)}
                      <span className="text-sm font-medium text-gray-900 flex-1">{issue.name}</span>
                      {expandedCriteria.includes(issue.name) ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card3D>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card3D>
              <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {getCategoryIcon(activeTab)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
                    <p className="text-gray-600 text-sm">{getCategoryDescription(activeTab)}</p>
                  </div>
                </div>

                {/* Score Summary */}
                <div className={`rounded-lg border p-6 mb-8 ${getScoreBg(currentFeedback.score)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-3xl font-bold ${getScoreColor(currentFeedback.score)}`}>
                        {currentFeedback.score}/100
                      </div>
                      <div className="text-gray-600 text-sm">
                        {currentFeedback.metCriteria} of {currentFeedback.totalCriteria} criteria meet the required scoring
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {currentFeedback.score >= 90 ? "EXCELLENT!" : 
                         currentFeedback.score >= 75 ? "GOOD WORK!" : "NEEDS IMPROVEMENT"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Feedback */}
                <div className="space-y-6">
                  {currentFeedback.issues.map((issue, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(issue.status)}
                        <h3 className="text-lg font-semibold text-gray-900">{issue.name}</h3>
                      </div>
                      
                      {issue.status === "success" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-green-800">GOOD WORK!</span>
                          </div>
                          <p className="text-gray-700 text-sm">{issue.details}</p>
                          
                          {issue.recommendations.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-green-800 mb-2">Included Contact Information</h4>
                              <ul className="space-y-1">
                                {issue.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {expandedCriteria.includes(issue.name) && issue.status !== "success" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="mb-3">
                            <p className="text-gray-700 text-sm">{issue.details}</p>
                          </div>
                          
                          {issue.recommendations.length > 0 && (
                            <div className="bg-white rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-1 bg-blue-100 rounded">
                                  <CheckCircle className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-blue-800">FOLLOW THESE BEST PRACTICES</span>
                                <ChevronUp className="h-4 w-4 text-blue-600 ml-auto" />
                              </div>
                              <ul className="space-y-2">
                                {issue.recommendations.map((rec, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-xs text-gray-500 mt-3 italic">
                                This criteria has been customized by your organization
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card3D>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl text-gray-900 mb-4 font-medium">My Scans</h1>
          <p className="text-gray-600 text-lg">Review your resume scan history and track improvements</p>
        </div>

        <div className="space-y-6">
          {scanHistory.map((scan, index) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card3D>
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{scan.fileName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{scan.jobTitle} at {scan.company}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(scan.scanDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(scan.overallScore)}`}>
                          {scan.overallScore}
                        </div>
                        <div className="text-sm text-gray-600">Overall Score</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedScan(scan)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Feedback
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(scan.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
