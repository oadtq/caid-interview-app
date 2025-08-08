"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, Play, ChevronDown, ChevronRight, Volume2, Settings, Maximize, FileText, CheckCircle, HelpCircle, Eye } from 'lucide-react'
import { useState } from "react"

export function ResumeCurriculum() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState("transcript")
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const lessons = [
    {
      id: 1,
      title: "Resume Essentials: Mastering Structure That Stands Out",
      duration: "08:42",
      completed: false,
      current: true,
      videoId: "Tt08KmFfIYQ",
    },
    {
      id: 2,
      title: "Advanced Formatting: Design Your Resume Like a Pro",
      duration: "09:15",
      completed: false,
      videoId: "R3abknwWX7k",
    },
    {
      id: 3,
      title: "Crafting a Resume That Speaks to Recruiters",
      duration: "11:30",
      completed: false,
      videoId: "rvKNhhhzkP8",
    },
    {
      id: 4,
      title: "How to Tailor Your Resume for AI Screening Systems",
      duration: "10:45",
      completed: false,
      videoId: "ck5nw7R1uEs",
    },
    {
      id: 5,
      title: "Writing Powerful Summaries that Get Noticed",
      duration: "07:20",
      completed: false,
      videoId: "Tt08KmFfIYQ", // Reusing first video for demo
    },
    {
      id: 6,
      title: "Real Examples: From Mediocre to Memorable Resumes",
      duration: "12:18",
      completed: false,
      videoId: "R3abknwWX7k", // Reusing second video for demo
    },
    {
      id: 7,
      title: "Using Keywords to Pass Resume Scanners",
      duration: "09:55",
      completed: false,
      videoId: "rvKNhhhzkP8", // Reusing third video for demo
    },
    {
      id: 8,
      title: "Final Review: Optimizing Your Resume Before You Hit Send",
      duration: "08:30",
      completed: false,
      videoId: "ck5nw7R1uEs", // Reusing fourth video for demo
    },
  ]

  const transcriptContent: Record<number, { title: string; content: string[] }> = {
    0: {
      title: "Resume Essentials: Mastering Structure That Stands Out",
      content: [
        "Welcome to EveryMatch's Resume Curriculum! I'm excited to help you create a resume that not only gets noticed but gets you hired.",
        "Today we're starting with the fundamentals - the structure that makes your resume stand out from the hundreds that recruiters see every day.",
        "Think of your resume as your personal marketing document. Just like any great marketing piece, it needs to grab attention immediately and guide the reader through your story in a logical, compelling way.",
        "The most effective resumes follow a proven structure: Contact Information, Professional Summary, Core Skills, Professional Experience, Education, and Additional Sections like certifications or projects.",
        "But here's what most people get wrong - they treat each section as a separate entity. The magic happens when these sections work together to tell a cohesive story about who you are and what value you bring.",
        "Let's break down each section and see how top performers structure their resumes to land interviews at companies like Google, Microsoft, and other industry leaders.",
        "By the end of this lesson, you'll understand exactly how to organize your information to maximize impact and readability.",
      ],
    },
  }

  const homeworkContent: Record<number, { title: string; assignments: { task: string; description: string; timeEstimate: string }[] }> = {
    0: {
      title: "Resume Essentials: Mastering Structure That Stands Out",
      assignments: [
        {
          task: "Resume Structure Audit",
          description:
            "Review your current resume and identify which sections you have and which are missing. Create a checklist of the 6 essential sections we discussed.",
          timeEstimate: "15 minutes",
        },
        {
          task: "Information Inventory",
          description:
            "Gather all your professional information and organize it by section. Don't worry about formatting yet - just collect everything you might include.",
          timeEstimate: "30 minutes",
        },
        {
          task: "Story Mapping Exercise",
          description:
            "Write a 2-3 sentence story about your career progression. This will help you understand how to connect your sections cohesively.",
          timeEstimate: "20 minutes",
        },
      ],
    },
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden mb-6 shadow-lg">
            <div className="aspect-video bg-black relative">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${lessons[currentLesson].videoId}?si=Ch5rder7lUFsSc0I`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Lesson Info */}
          <div className="mb-6">
            <h1 className="text-gray-900 mb-3 text-xl font-normal">{lessons[currentLesson].title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-sm">
                Lesson by: <span className="font-medium text-blue-600">EveryMatch Team</span>
              </span>
              <span>•</span>
              <span className="text-sm">{lessons[currentLesson].duration}</span>
              <span>•</span>
              <span className="text-sm">
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("transcript")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "transcript"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Transcript
                </div>
              </button>
              <button
                onClick={() => setActiveTab("homework")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "homework"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Homework
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            {activeTab === "transcript" && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lesson Transcript</h3>
                  <p className="text-gray-600">Follow along with the complete lesson content below.</p>
                </div>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {transcriptContent[currentLesson]?.content.map((paragraph: string, index: number) => (
                    <p key={index} className="text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "homework" && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Assignments</h3>
                  <p className="text-gray-600">
                    Complete these exercises to reinforce your learning and apply the concepts.
                  </p>
                </div>

                <div className="space-y-6">
                  {homeworkContent[currentLesson]?.assignments.map((assignment: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">{assignment.task}</h4>
                        <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {assignment.timeEstimate}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{assignment.description}</p>
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <HelpCircle className="w-4 h-4 mr-2" />
                          View Questions
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Answers
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
                  <p className="text-blue-800">
                    Don't rush through these exercises. The time you invest in properly structuring your resume
                    foundation will save you hours of revision later and significantly improve your interview callback
                    rate.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-600 uppercase text-sm tracking-wide">COURSE</span>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Resume Mastery</h2>
                <div className="text-right text-sm text-gray-500">0 / 8</div>
              </div>

              {/* Course Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900">1. Resume Curriculum</span>
                  </div>
                  <span className="text-sm text-gray-500">0/8</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {lessons.map((lesson, index) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-200 ${
                          index === currentLesson ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setCurrentLesson(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                lesson.completed
                                  ? "bg-green-500 border-green-500"
                                  : index === currentLesson
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300 hover:border-blue-300"
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="w-3 h-3 text-white" />
                              ) : index === currentLesson ? (
                                <Play className="w-3 h-3 text-white" />
                              ) : (
                                <Play className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-medium text-sm leading-tight mb-1 ${
                                index === currentLesson ? "text-blue-900" : "text-gray-900"
                              }`}
                            >
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>{lesson.duration}</span>
                              <span>•</span>
                              <span>Video</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Your Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-blue-800">
                  <span>Completed:</span>
                  <span>0 / 8 lessons</span>
                </div>
                <div className="flex justify-between text-blue-800">
                  <span>Time invested:</span>
                  <span>0 minutes</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                  <div className="bg-blue-600 h-2 rounded-full w-0 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
