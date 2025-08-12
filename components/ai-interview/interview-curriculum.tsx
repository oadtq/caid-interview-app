"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, X, FileText, ArrowLeft, Brain } from 'lucide-react'
import curriculumData from "./interview-curriculum.json"

// Lesson Viewer Component (similar to resume curriculum)
function LessonViewer({ 
  lessonData, 
  onBack 
}: { 
  lessonData: any, 
  onBack: () => void 
}) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("transcript")
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : ""
  }

  const currentVideo = lessonData.Videos[currentVideoIndex]
  const videoId = extractVideoId(currentVideo.Link)

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const calculateQuizScore = () => {
    const currentMCQs = currentVideo.MCQs || []
    let correct = 0
    currentMCQs.forEach((mcq: any, index: number) => {
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

  const handleNextVideo = () => {
    if (currentVideoIndex < lessonData.Videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
      setQuizAnswers({})
      setShowQuizResults(false)
    }
  }

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
      setQuizAnswers({})
      setShowQuizResults(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Curriculum
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{lessonData.Name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-sm">
                Video {currentVideoIndex + 1} of {lessonData.Videos.length}
              </span>
            </div>
          </div>

          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden mb-6 shadow-lg">
            <div className="aspect-video bg-black relative">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?si=Ch5rder7lUFsSc0I`}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentVideo.Title}</h2>
            <p className="text-gray-600">{currentVideo.Description}</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mb-6">
            <Button
              onClick={handlePrevVideo}
              disabled={currentVideoIndex === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              Previous Video
            </Button>
            <Button
              onClick={handleNextVideo}
              disabled={currentVideoIndex === lessonData.Videos.length - 1}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Next Video
            </Button>
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
                onClick={() => setActiveTab("quiz")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "quiz"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Quiz
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
                  <p className="text-base">
                    This video covers important concepts about {currentVideo.Title.toLowerCase()}. 
                    Watch the video above to learn the complete content and then test your knowledge with the quiz.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Knowledge Check</h3>
                  <p className="text-gray-600">
                    Test your understanding of the lesson with these multiple choice questions.
                  </p>
                </div>

                {!showQuizResults ? (
                  <div className="space-y-8">
                    {currentVideo.MCQs?.map((mcq: any, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-colors"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Question {index + 1}: {mcq.Question}
                        </h4>
                        <div className="space-y-3">
                          {mcq.Options.map((option: string, optionIndex: number) => (
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
                        disabled={Object.keys(quizAnswers).length < (currentVideo.MCQs?.length || 0)}
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
                      {currentVideo.MCQs?.map((mcq: any, index: number) => (
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
                            {mcq.Options.map((option: string, optionIndex: number) => (
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
                      <Button 
                        onClick={() => setActiveTab("transcript")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Review Lesson
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-600 uppercase text-sm tracking-wide">VIDEOS</span>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{lessonData.Name}</h2>
                <div className="text-right text-sm text-gray-500">{lessonData.Videos.length} videos</div>
              </div>

              {/* Video List */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {lessonData.Videos.map((video: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-200 ${
                      index === currentVideoIndex ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentVideoIndex(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            index === currentVideoIndex
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 hover:border-blue-300"
                          }`}
                        >
                          <Play className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-sm leading-tight mb-1 ${
                            index === currentVideoIndex ? "text-blue-900" : "text-gray-900"
                          }`}
                        >
                          {video.Title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>Video {index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InterviewCurriculum() {
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)

  // If a lesson is selected, show the lesson viewer
  if (selectedLesson) {
    return <LessonViewer lessonData={selectedLesson} onBack={() => setSelectedLesson(null)} />
  }

  const handleStartLesson = (lesson: any) => {
    setSelectedLesson(lesson)
  }

  const handlePlayVideo = (videoId: string) => {
    setCurrentVideoId(videoId)
    setIsVideoModalOpen(true)
  }

  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
    setCurrentVideoId(null)
  }

  const LessonItem = ({ lesson, type }: { lesson: any, type: 'video' | 'article' }) => (
    <div className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
      <div 
        className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors ${
          type === 'article' ? 'hover:bg-blue-100' : ''
        }`}
        onClick={() => type === 'video' ? handlePlayVideo(lesson.Link) : window.open(lesson.Link, '_blank')}
      >
        {type === 'video' ? (
          <Play className="h-4 w-4 text-gray-600" />
        ) : (
          <FileText className="h-4 w-4 text-gray-600" />
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{lesson.Title}</div>
        <div className="text-sm text-gray-500">{lesson.Description}</div>
      </div>
    </div>
  )

  const CategoryCard = ({ title, data, type }: { title: string, data: any, type: 'lesson' | 'playbook' }) => (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{data.Videos ? `${data.Videos.length} videos` : `${data.Articles.length} articles`}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {type === 'lesson' ? (
          data.Videos.map((video: any, index: number) => (
            <LessonItem key={index} lesson={video} type="video" />
          ))
        ) : (
          data.Articles.map((article: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 hover:bg-blue-50 rounded-lg px-2 cursor-pointer transition-colors"
              onClick={() => window.open(article.Link, '_blank')}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors">
                <FileText className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{article.Title}</div>
                <div className="text-sm text-gray-500">{article.Description}</div>
              </div>
            </div>
          ))
        )}
        {type === 'lesson' && (
          <div className="pt-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => handleStartLesson(data)}
            >
              Start Lesson
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Curriculum</h1>
        <p className="text-gray-600">Structured learning paths to master interview skills</p>
      </div>

      {/* Lessons Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {curriculumData.Lessons.map((lesson, index) => (
            <CategoryCard key={index} title={lesson.Name} data={lesson} type="lesson" />
          ))}
        </div>
      </div>

      {/* Playbooks Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Playbooks</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {curriculumData.Playbooks.map((playbook, index) => (
            <CategoryCard key={index} title={playbook.Name} data={playbook} type="playbook" />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && currentVideoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Video Preview</h3>
              <button
                onClick={closeVideoModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
