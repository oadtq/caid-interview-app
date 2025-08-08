"use client"

import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Upload, FileText, Zap, Target, CheckCircle, ArrowRight, Sparkles, Clock, TrendingUp, X, AlertCircle } from 'lucide-react'
import Image from "next/image"

interface ResumeAIProps {
  setActiveTab: (tab: string) => void
}

export function ResumeAI({ setActiveTab }: ResumeAIProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileSelect = (file: File) => {
    setError(null)

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only")
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setUploadedFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleScanResume = async () => {
    if (!uploadedFile) {
      setError("Please upload a resume file before scanning")
      return
    }

    setIsScanning(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)

      const response = await fetch('/api/resume/scan', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to scan resume')
      }

      const result = await response.json()
      
      // Navigate to My Scans with the scan result
      setActiveTab("my-scans")
    } catch (error) {
      console.error('Error scanning resume:', error)
      setError('Failed to scan resume. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const analysisFeatures = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Keyword Optimization",
      description: "AI analyzes job descriptions and optimizes your resume with relevant keywords",
      image: "/images/keyword-optimization-final.png"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI Analysis",
      description: "Advanced algorithms evaluate content structure, formatting, and impact",
      image: "/images/ai-analysis-final.png"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Grammar & Formatting",
      description: "Comprehensive review of language, grammar, and professional formatting",
      image: "/images/grammar-formatting-final.png"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Performance Tracking",
      description: "Track improvements and measure resume effectiveness over time",
      image: "/images/performance-tracking-updated.png"
    }
  ]

  const steps = [
    {
      number: 1,
      title: "Upload Resume",
      description: "Upload your current resume in PDF format",
      icon: <Upload className="h-5 w-5" />
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Our AI analyzes your resume against industry standards",
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      number: 3,
      title: "Get Feedback",
      description: "Receive detailed feedback and improvement suggestions",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl text-gray-900 mb-4 font-medium">ResumeAI Scanner</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Get instant AI-powered feedback on your resume with actionable insights to improve your job application success rate
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                <p className="text-gray-600">
                  Upload your resume and get instant AI-powered analysis and feedback
                </p>
              </div>

              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <span className="text-lg font-medium text-gray-900 mb-2">
                      Choose file or drag and drop
                    </span>
                    <span className="text-sm text-gray-500">PDF files up to 10MB</span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile} className="text-gray-500 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              <div className="mt-6 flex gap-4">
                <Button
                  variant="outline"
                  onClick={removeFile}
                  className="flex-1"
                  disabled={isScanning}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleScanResume}
                  disabled={!uploadedFile || isScanning}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isScanning ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Scan Resume
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Connection Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
              
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center max-w-xs"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-lg mb-4 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* What Our AI Analyzes */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Our AI Analyzes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our advanced AI system evaluates multiple aspects of your resume to provide comprehensive feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {analysisFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card3D>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-full">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                      <div className="w-full h-48 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.title}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card3D>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Optimize Your Resume?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who have improved their job application success rate with our AI-powered resume analysis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setActiveTab("my-scans")}
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                >
                  View My Scans
                </Button>
                <Button
                  onClick={() => setActiveTab("resume-builder")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Build Resume
                </Button>
              </div>
            </div>
          </Card3D>
        </motion.div>
      </motion.div>
    </div>
  )
}
