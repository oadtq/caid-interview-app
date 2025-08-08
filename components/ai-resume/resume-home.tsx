"use client"

import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Scan,
  TrendingUp,
  Clock,
  Award,
  Users,
  Star,
  Upload,
  Sparkles,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ResumeHomeProps {
  onGetStarted: () => void
}

export function ResumeHome({ onGetStarted }: ResumeHomeProps) {
  const features = [
    {
      image: "/images/keyword-optimization-new.png",
      title: "Keyword Optimization",
      description: "Identify missing keywords and optimize your resume for applicant tracking systems (ATS).",
    },
    {
      image: "/images/ai-analysis-new.png",
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your resume for content, structure, and ATS compatibility.",
    },
    {
      image: "/images/grammar-formatting-new.png",
      title: "Grammar & Formatting",
      description: "Comprehensive review of grammar, spelling, and formatting to match professional standards.",
    },
    {
      image: "/images/performance-tracking-new.png",
      title: "Performance Tracking",
      description: "Track improvements over time with version history and detailed performance analytics.",
    },
  ]

  const howItWorksSteps = [
    {
      step: 1,
      icon: Upload,
      title: "Upload Resume",
      description: "Upload your PDF resume (max 10MB)",
    },
    {
      step: 2,
      icon: Sparkles,
      title: "AI Analysis",
      description: "Our AI analyzes content, grammar, and formatting",
    },
    {
      step: 3,
      icon: MessageSquare,
      title: "Get Feedback",
      description: "Receive detailed feedback and improvement suggestions",
    },
    {
      step: 4,
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor improvements across multiple versions",
    },
  ]

  const stats = [
    { label: "Review Time", value: "< 2 mins", icon: Clock },
    { label: "Improvement Rate", value: "85%", icon: TrendingUp },
    { label: "Success Rate", value: "92%", icon: Award },
    { label: "Students Helped", value: "10,000+", icon: Users },
  ]

  const modules = [
    {
      title: "Resume Scan",
      description: "Upload and analyze your resume with AI-powered feedback",
      icon: Scan,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      action: () => onGetStarted(),
    },
    {
      title: "Resume Templates",
      description: "Choose from ATS-friendly, modern resume templates",
      icon: FileText,
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      action: () => {},
    },
    {
      title: "Cover Letters",
      description: "Generate AI-powered cover letters tailored to job descriptions",
      icon: FileText,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      action: () => {},
    },
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
          <p className="text-gray-600 text-lg">
            Ready to optimize your resume with AI? Let's enhance your career prospects.
          </p>
        </div>
      </motion.div>

      {/* AI Resume Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <Card3D>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl text-gray-900 font-medium">AI Resume Tools</h2>
                  <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-700">
                    <Star className="h-3 w-3 mr-1" />
                    Featured Tool
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Get comprehensive AI-generated resume reviews and improvement suggestions to maximize your chances of
              landing interviews
            </p>

            {/* Resume Tools Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                    <Scan className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg text-gray-900 mb-2 font-medium">Resume Scan</h3>
                <p className="text-sm text-gray-600 mb-4">Upload and analyze your resume with AI-powered feedback.</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg text-gray-900 mb-2 font-medium">Resume Templates</h3>
                <p className="text-sm text-gray-600 mb-4">Choose from ATS-friendly, modern resume templates.</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg text-gray-900 mb-2 font-medium">Cover Letters</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Generate AI-powered cover letters tailored to job descriptions.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                onClick={onGetStarted}
                className="bg-[#114ef7] hover:bg-[#0f46d1] text-white px-8 py-3 font-medium flex items-center gap-2 shadow-lg text-base"
              >
                <Star className="h-5 w-5 animate-pulse" />
                Start with AI Resume
              </Button>
            </div>
          </div>
        </Card3D>
      </motion.div>

      {/* Why Choose Our AI Resume - Clean White Background */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4 font-medium">Why choose our AI resume?</h2>
          <p className="text-gray-600 text-lg">
            A suite of powerful AI tools to help you navigate this recruiting season
          </p>
        </div>

        {/* Clean White Background Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1: Keyword Optimization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg mb-6 text-base">
                <Image
                  src="/images/keyword-optimization-final.png"
                  alt="Keyword Optimization"
                  width={320}
                  height={240}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </div>
            <h3 className="text-xl text-gray-900 mb-3 font-medium">Keyword Optimization</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Identify missing keywords and optimize your resume for applicant tracking systems (ATS).
            </p>
          </motion.div>

          {/* Card 2: AI-Powered Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
                <Image
                  src="/images/ai-analysis-final.png"
                  alt="AI-Powered Analysis"
                  width={320}
                  height={240}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </div>
            <h3 className="text-xl text-gray-900 mb-3 font-medium">AI-Powered Analysis</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Advanced algorithms analyze your resume for content, structure, and ATS compatibility.
            </p>
          </motion.div>

          {/* Card 3: Grammar & Formatting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
                <Image
                  src="/images/grammar-formatting-final.png"
                  alt="Grammar & Formatting"
                  width={320}
                  height={240}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </div>
            <h3 className="text-xl text-gray-900 mb-3 font-medium">Grammar & Formatting</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Comprehensive review of grammar, spelling, and formatting to match professional standards.
            </p>
          </motion.div>

          {/* Card 4: Performance Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
                <Image
                  src="/images/performance-tracking-updated.png"
                  alt="Performance Tracking"
                  width={320}
                  height={240}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </div>
            <h3 className="text-xl text-gray-900 mb-3 font-medium">Performance Tracking</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Track improvements over time with version history and detailed performance analytics.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mb-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4 font-medium">How It Works</h2>
          <p className="text-gray-600 text-lg">Simple 4-step process to improve your resume</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                <div className="mb-6">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mx-auto mb-4">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-lg text-gray-900 mb-3 font-medium">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
