"use client"

import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { useState, useCallback } from "react"
import { Upload, FileText, Zap, Target, CheckCircle, ArrowRight, Sparkles, Clock, TrendingUp, X, AlertCircle, Scan, Eye, Shield, Layout } from 'lucide-react'
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [])

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
      number: "1",
      icon: Eye,
      title: "Readability",
      description: "Ensures your resume is clear and easy to read.",
      message: "Your resume meets the required scoring criteria for this section.",
    },
    {
      number: "2",
      icon: Shield,
      title: "Credibility",
      description: "Validates your experience and qualifications.",
      message: "Your resume meets the required scoring criteria for this section.",
    },
    {
      number: "3",
      icon: Target,
      title: "ATS Fit",
      description: "Optimizes your resume for applicant tracking systems.",
      message: "Your resume meets the required scoring criteria for this section.",
    },
    {
      number: "4",
      icon: Layout,
      title: "Format",
      description: "Checks the structure and layout of your resume.",
      message: "Your resume meets the required scoring criteria for this section.",
    },
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full w-20 h-20 mx-auto mb-6">
          <Scan className="h-12 w-12 text-blue-600" />
        </div>
        <h1 className="text-4xl text-gray-900 mb-4 font-medium">ResumeAI Scanner</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
          Upload your resume and get instant AI-powered feedback to optimize for ATS systems and improve your chances of
          landing interviews
        </p>
      </motion.div>

      {/* Enhanced Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16 max-w-4xl mx-auto"
      >
        <Card3D>
          <div className="bg-white rounded-xl border border-gray-100 p-12 shadow-sm">
            <div
              className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="p-6 bg-gray-50 rounded-full w-24 h-24 mx-auto mb-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-4 font-medium text-xl">Drop your resume here, or click to browse</h3>
              <p className="text-gray-600 mb-6 text-base">Supports PDF files up to 10MB</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Button
                  size="lg"
                  style={{ backgroundColor: "#114EF7" }}
                  className="hover:opacity-90 text-white px-8 py-3"
                  asChild
                >
                  <span>
                    <Upload className="h-5 w-5 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              {uploadedFile && (
                <div className="space-y-4 mt-4">
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
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
            {/* Action Buttons - Outside dashed border */}
            <div className="pt-8">
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={removeFile}
                  size="lg"
                  className="px-8 py-3"
                  disabled={isScanning}
                >
                  Exit
                </Button>
                <Button
                  onClick={handleScanResume}
                  disabled={!uploadedFile || isScanning}
                  size="lg"
                  style={{ backgroundColor: "#114EF7" }}
                  className="px-8 py-3 hover:opacity-90 text-white disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      Scan Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card3D>
      </motion.div>

      {/* Analysis Features - 4 Column Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4 font-medium">AI Analysis Features</h2>
          <p className="text-gray-600 text-lg">Comprehensive resume analysis in multiple dimensions</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {analysisFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            >
              <Card3D>
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm text-center">
                  {/* Number Badge - Blue */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#114EF7" }}
                  >
                    <span className="text-lg font-bold text-white">{feature.number}</span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl text-gray-900 mb-3 font-medium">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">{feature.description}</p>

                  {/* Success Section - Green as reference */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3 transform rotate-45">
                      <CheckCircle className="h-5 w-5 text-white transform -rotate-45" />
                    </div>
                    <div className="text-green-600 font-semibold mb-2">GOOD WORK!</div>
                    <p className="text-gray-600 text-sm">{feature.message}</p>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
    </div>
  )
}
