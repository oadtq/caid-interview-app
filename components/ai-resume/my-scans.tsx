"use client"

import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { FileText, Calendar, Eye, Trash2, ArrowLeft, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Target, Type, Layout, Shield } from 'lucide-react'

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
  const [scanHistory, setScanHistory] = useState<ScanData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchScans()
  }, [])

  const fetchScans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/resume/scans')
      
      if (!response.ok) {
        throw new Error('Failed to fetch scans')
      }

      const data = await response.json()
      
      // Transform database format to match the expected interface
      const transformedScans: ScanData[] = data.scans.map((scan: any) => {
        const aiFeedback = scan.ai_feedback || {}
        
        return {
          id: scan.id,
          fileName: scan.filename,
          jobTitle: "Software Engineer", // Default for now
          company: "Company", // Default for now
          scanDate: new Date(scan.created_at).toLocaleDateString(),
          overallScore: scan.overall_score || 0, // Use 1-10 scale directly
          status: "completed" as const,
          feedback: {
            readability: {
              score: aiFeedback.content_quality?.score || 0, // Use 1-10 scale directly
              metCriteria: 2,
              totalCriteria: 4,
              issues: aiFeedback.content_quality?.categories?.map((category: any) => ({
                name: category.name,
                status: category.status as "error" | "warning" | "success",
                details: category.details,
                recommendations: category.recommendations
              })) || []
            },
            credibility: {
              score: aiFeedback.impact_achievements?.score || 0, // Use 1-10 scale directly
              metCriteria: 3,
              totalCriteria: 5,
              issues: aiFeedback.impact_achievements?.categories?.map((category: any) => ({
                name: category.name,
                status: category.status as "error" | "warning" | "success",
                details: category.details,
                recommendations: category.recommendations
              })) || []
            },
            atsfit: {
              score: aiFeedback.keyword_optimization?.score || 0, // Use 1-10 scale directly
              metCriteria: 2,
              totalCriteria: 4,
              issues: aiFeedback.keyword_optimization?.categories?.map((category: any) => ({
                name: category.name,
                status: category.status as "error" | "warning" | "success",
                details: category.details,
                recommendations: category.recommendations
              })) || []
            },
            format: {
              score: aiFeedback.formatting_structure?.score || 0, // Use 1-10 scale directly
              metCriteria: 3,
              totalCriteria: 4,
              issues: aiFeedback.formatting_structure?.categories?.map((category: any) => ({
                name: category.name,
                status: category.status as "error" | "warning" | "success",
                details: category.details,
                recommendations: category.recommendations
              })) || []
            }
          }
        }
      })

      setScanHistory(transformedScans)
    } catch (error) {
      console.error('Error fetching scans:', error)
      setError('Failed to load scans')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600"
    if (score >= 7) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 9) return "bg-green-50 border-green-200"
    if (score >= 7) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  const handleDelete = async (scanId: string) => {
    if (!confirm('Are you sure you want to delete this scan? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/resume/scans/${scanId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete scan')
      }

      // Remove the scan from the local state
      setScanHistory(prev => prev.filter(scan => scan.id !== scanId))
    } catch (error) {
      console.error('Error deleting scan:', error)
      alert('Failed to delete scan. Please try again.')
    }
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
                      className="flex items-center gap-3 p-3 rounded-lg"
                    >
                      {getStatusIcon(issue.status)}
                      <span className="text-sm font-medium text-gray-900 flex-1">{issue.name}</span>
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
                        {currentFeedback.score}/10
                      </div>
                      <div className="text-gray-600 text-sm">
                        {currentFeedback.metCriteria} of {currentFeedback.totalCriteria} criteria meet the required scoring
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {currentFeedback.score >= 9 ? "EXCELLENT!" : 
                         currentFeedback.score >= 7 ? "GOOD WORK!" : "NEEDS IMPROVEMENT"}
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
                              <h4 className="font-semibold text-green-800 mb-2">Recommendations</h4>
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

                      {issue.status !== "success" && (
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your scans...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Scans</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={fetchScans} className="bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && scanHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Scans Yet</h3>
              <p className="text-gray-600 mb-4">Upload and scan your first resume to get started</p>
              <Button onClick={() => window.location.href = '/ai-resume'} className="bg-blue-600 hover:bg-blue-700">
                Scan Resume
              </Button>
            </div>
          </div>
        )}

        {/* Scans List */}
        {!loading && !error && scanHistory.length > 0 && (
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
                              {scan.scanDate}
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
        )}
      </motion.div>
    </div>
  )
}
