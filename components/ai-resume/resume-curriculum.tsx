"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, Play, ChevronDown, ChevronRight, Volume2, Settings, Maximize, FileText, CheckCircle, HelpCircle, Eye, Brain } from 'lucide-react'
import { useState } from "react"
import curriculumData from "./resume-curriculum.json"

export function ResumeCurriculum() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : ""
  }

  // Transform JSON data to lessons format
  const lessons = curriculumData.map((item, index) => ({
    id: index + 1,
    title: item.Title,
    duration: item.Duration, // Use actual duration from JSON
    current: index === 0,
    videoId: extractVideoId(item.Link),
    mcqs: item.MCQs
  }))

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const calculateQuizScore = () => {
    const currentMCQs = lessons[currentLesson]?.mcqs || []
    let correct = 0
    currentMCQs.forEach((mcq, index) => {
      if (quizAnswers[index] === mcq.Answer) {
        correct++
      }
    })
    return { correct, total: currentMCQs.length, percentage: Math.round((correct / currentMCQs.length) * 100) }
  }

  const handleSubmitQuiz = () => {
    setShowQuizResults(true)
  }

  const handleRetakeQuiz = () => {
    setQuizAnswers({})
    setShowQuizResults(false)
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
                src={`https://www.youtube.com/embed/${lessons[currentLesson]?.videoId}?si=Ch5rder7lUFsSc0I`}
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
            <h1 className="text-gray-900 mb-3 text-xl font-normal">{lessons[currentLesson]?.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-sm">
                Duration:
              <span className="text-sm"> {lessons[currentLesson]?.duration}</span>
              </span>
              <span>•</span>
              <span className="text-sm">
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Knowledge Check</h3>
                <p className="text-gray-600">
                  Test your understanding of the lesson with these multiple choice questions.
                </p>
              </div>

              {!showQuizResults ? (
                <div className="space-y-8">
                  {lessons[currentLesson]?.mcqs?.map((mcq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Question {index + 1}: {mcq.Question}
                      </h4>
                      <div className="space-y-3">
                        {mcq.Options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option.charAt(0)}
                              checked={quizAnswers[index] === option.charAt(0)}
                              onChange={() => handleQuizAnswer(index, option.charAt(0))}
                              className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center pt-6">
                    <Button 
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(quizAnswers).length < (lessons[currentLesson]?.mcqs?.length || 0)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                      Submit Quiz
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">Quiz Results</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {calculateQuizScore().percentage}%
                    </div>
                    <p className="text-blue-800">
                      You got {calculateQuizScore().correct} out of {calculateQuizScore().total} questions correct!
                    </p>
                  </div>

                  <div className="space-y-6">
                    {lessons[currentLesson]?.mcqs?.map((mcq, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-6 ${
                          quizAnswers[index] === mcq.Answer
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Question {index + 1}: {mcq.Question}
                        </h4>
                        <div className="space-y-2">
                          {mcq.Options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg ${
                                option.charAt(0) === mcq.Answer
                                  ? "bg-green-100 border border-green-300"
                                  : option.charAt(0) === quizAnswers[index] && option.charAt(0) !== mcq.Answer
                                  ? "bg-red-100 border border-red-300"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <span className={`font-medium ${
                                option.charAt(0) === mcq.Answer
                                  ? "text-green-700"
                                  : option.charAt(0) === quizAnswers[index] && option.charAt(0) !== mcq.Answer
                                  ? "text-red-700"
                                  : "text-gray-700"
                              }`}>
                                {option}
                                {option.charAt(0) === mcq.Answer && " ✓"}
                                {option.charAt(0) === quizAnswers[index] && option.charAt(0) !== mcq.Answer && " ✗"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 pt-6">
                    <Button 
                      onClick={handleRetakeQuiz}
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Retake Quiz
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
                                index === currentLesson
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300 hover:border-blue-300"
                              }`}
                            >
                              {index === currentLesson ? (
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
            {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Your Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-blue-800">
                  <span>Completed:</span>
                  <span>0 / {lessons.length} lessons</span>
                </div>
                <div className="flex justify-between text-blue-800">
                  <span>Time invested:</span>
                  <span>0 minutes</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                  <div className="bg-blue-600 h-2 rounded-full w-0 transition-all duration-300"></div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
