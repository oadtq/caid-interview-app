"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Sparkles, FileText, Target, Users, TrendingUp, Clock, CheckCircle, Copy, Download } from 'lucide-react'

export function GenerateCoverLetter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [industry, setIndustry] = useState("")
  const [tone, setTone] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file only")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleGenerate = async () => {
    if (!jobTitle || !companyName) {
      setError("Please fill in job title and company name")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('resume', selectedFile)
      }
      formData.append('jobTitle', jobTitle)
      formData.append('companyName', companyName)
      formData.append('jobDescription', jobDescription)
      formData.append('industry', industry)
      formData.append('tone', tone)

      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate cover letter')
      }

      const result = await response.json()
      setGeneratedCoverLetter(result.coverLetter)
    } catch (error) {
      console.error('Error generating cover letter:', error)
      setError('Failed to generate cover letter. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCoverLetter)
  }

  const downloadCoverLetter = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedCoverLetter], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${companyName}_${jobTitle}_cover_letter.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const stats = [
    {
      icon: Target,
      value: "100%",
      label: "Tailored for Vietnam",
      color: "text-blue-600",
    },
    {
      icon: Users,
      value: "50k+",
      label: "Cover Letters Generated",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      value: "3x",
      label: "Higher Response Rate",
      color: "text-purple-600",
    },
  ]

  if (generatedCoverLetter) {
    return (
      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-full w-20 h-20 mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-4 font-medium">Cover Letter Generated!</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Your personalized cover letter for {jobTitle} at {companyName}
            </p>
          </div>

          {/* Generated Cover Letter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {generatedCoverLetter}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </Button>
            <Button onClick={downloadCoverLetter} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download as Text
            </Button>
            <Button 
              onClick={() => {
                setGeneratedCoverLetter("")
                setJobTitle("")
                setCompanyName("")
                setJobDescription("")
                setSelectedFile(null)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Generate Another
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl text-gray-900 mb-4 font-medium">Generate Cover Letter</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            Create compelling, personalized cover letters with AI assistance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Create Cover Letter Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Your Cover Letter</h2>
          
          <div className="space-y-6">
            {/* Job Title and Company Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 mb-2 block">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g., Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="e.g., Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Job Description */}
            <div>
              <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700 mb-2 block">
                Job Description (Optional)
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here for better personalization..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full min-h-[120px] resize-none"
              />
            </div>

            {/* Upload Resume */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Upload Resume (Optional)
              </Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-300 transition-colors">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-gray-600 mb-4">Upload your resume to personalize the cover letter</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="bg-white">
                      Choose File
                    </Button>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Industry and Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Industry
                </Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tone
                </Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Professional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  Generating Cover Letter...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Cover Letter
                </div>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
