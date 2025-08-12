"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, PlayCircle, BookOpen, Award, ArrowRight, CheckCircle, Star, Layers, Target, GraduationCap, Brain, MessageSquare, AlertTriangle, Shield, Users, Activity, Volume, Lightbulb } from "lucide-react"

interface QuestionSetData {
  [key: string]: {
    [key: string]: string[] | {
      [key: string]: string[]
    }
  }
}

interface InterviewResponse {
  id: string
  session_id: string
  question_text: string
  video_url: string | null
  transcription: string | null
  duration: number | null
  overall_score: number | null
  ai_feedback: Record<string, unknown> | null
  created_at: string
  interview_sessions: {
    session_name: string
    question_set_id: string
  }
}

interface RecommendedTask {
  title: string
  description: string
  type: string
  priority: string
  estimatedTime: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  subCategory: string
}

interface RecentActivity {
  action: string
  time: string
  score: number | null
  responseId: string
}

export function InterviewHome({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const router = useRouter()
  const [questionData, setQuestionData] = useState<QuestionSetData>({})
  const [responses, setResponses] = useState<InterviewResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch question sets data
        const questionResponse = await fetch('/api/interview/question-sets-data')
        const questionData = await questionResponse.json()
        setQuestionData(questionData)

        // Fetch recent responses
        const responsesResponse = await fetch('/api/interview/responses')
        const responsesData = await responsesResponse.json()
        setResponses(responsesData.responses || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSubIconForCategory = (subCategory: string) => {
    if (subCategory.includes("Marketing")) return MessageSquare
    if (subCategory.includes("Finance")) return Activity
    if (subCategory.includes("Technology") || subCategory.includes("Computer")) return Brain
    if (subCategory.includes("Management") || subCategory.includes("Leadership")) return Users
    if (subCategory.includes("Engineering")) return Shield
    if (subCategory.includes("Psychology")) return Lightbulb
    if (subCategory.includes("Economics")) return Target
    if (subCategory.includes("Communication")) return Volume
    if (subCategory.includes("Entry") || subCategory.includes("Internship")) return GraduationCap
    if (subCategory.includes("Senior") || subCategory.includes("Managerial")) return Award
    if (subCategory.includes("Career Change")) return ArrowRight
    if (subCategory.includes("Elevator Pitch")) return MessageSquare
    if (subCategory.includes("Top 20")) return Star
    if (subCategory.includes("Uncomfortable")) return AlertTriangle
    return Layers
  }

  const getRecommendedTasks = (): RecommendedTask[] => {
    const tasks: RecommendedTask[] = []
    const categories = Object.keys(questionData)
    
    // Get 3 random sub-categories from different parent categories
    const usedCategories = new Set<string>()
    
    for (const category of categories) {
      if (tasks.length >= 3) break
      
      const categoryData = questionData[category]
      if (!categoryData) continue
      
      const subCategories = Object.keys(categoryData)
      
      for (const subCategory of subCategories) {
        if (tasks.length >= 3) break
        if (usedCategories.has(category)) continue
        
        const Icon = getSubIconForCategory(subCategory)
        const questionCount = Array.isArray(categoryData[subCategory]) 
          ? categoryData[subCategory].length 
          : Object.values(categoryData[subCategory] as Record<string, unknown>).reduce((acc: number, val: unknown) => acc + (Array.isArray(val) ? val.length : 0), 0)
        
        tasks.push({
          title: subCategory,
          description: `Practice questions in ${subCategory.toLowerCase()}`,
          type: "subcategory",
          priority: category,
          estimatedTime: `${Math.ceil(questionCount / 3)} mins`,
          icon: Icon,
          category,
          subCategory
        })
        
        usedCategories.add(category)
      }
    }
    
    return tasks.slice(0, 3)
  }

  const getRecentActivity = (): RecentActivity[] => {
    return responses.slice(0, 4).map(response => {
      const timeAgo = getTimeAgo(new Date(response.created_at))
      const score = response.overall_score ? Math.round(response.overall_score * 10) : null
      
      return {
        action: `Completed ${response.interview_sessions?.session_name || 'Practice Session'}`,
        time: timeAgo,
        score,
        responseId: response.id
      }
    })
  }

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  const handleRecommendedTaskClick = (task: RecommendedTask) => {
    const params = new URLSearchParams({
      tab: 'practice',
      category: task.category,
    })
    router.push(`/ai-interview?${params.toString()}`)
  }

  const handleRecentActivityClick = () => {
    if (onTabChange) {
      onTabChange('videos')
    }
  }

  const handleViewAllQuestionSets = () => {
    if (onTabChange) {
      onTabChange('question-sets')
    }
  }

  const handleViewFullPracticeHistory = () => {
    if (onTabChange) {
      onTabChange('videos')
    }
  }

  const handleStartPracticeSession = () => {
    if (onTabChange) {
      onTabChange('practice')
    }
  }

  const handleStartLearning = () => {
    if (onTabChange) {
      onTabChange('curriculum')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your interview dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const recommendedTasks = getRecommendedTasks()
  const recentActivity = getRecentActivity()

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
        <p className="text-gray-600 text-lg">
          Ready to ace your next interview? Let&apos;s continue your preparation journey.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Recommended Tasks */}
        <div className="h-full">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended for You</h2>

            <div className="space-y-4 flex-1">
              {recommendedTasks.length > 0 ? (
                recommendedTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => handleRecommendedTaskClick(task)}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        task.priority === "General"
                          ? "bg-blue-50"
                          : task.priority === "By College (VinUni)"
                            ? "bg-green-50"
                            : "bg-purple-50"
                      }`}
                    >
                      <task.icon
                        className={`h-5 w-5 ${
                          task.priority === "General"
                            ? "text-blue-600"
                            : task.priority === "By College (VinUni)"
                              ? "text-green-600"
                              : "text-purple-600"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {task.estimatedTime}
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No question sets available</p>
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-6 bg-primary hover:bg-primary/90 h-12 text-base font-medium rounded-lg"
              onClick={handleViewAllQuestionSets}
            >
              View All Question Sets
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="h-full">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

            <div className="space-y-4 flex-1">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={handleRecentActivityClick}
                  >
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{activity.action}</h3>
                      <p className="text-gray-500 text-sm">{activity.time}</p>
                    </div>

                    {activity.score && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <Star className="h-4 w-4" />
                          {activity.score}%
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start practicing to see your progress here</p>
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-6 bg-primary hover:bg-primary/90 h-12 text-base font-medium rounded-lg"
              onClick={handleViewFullPracticeHistory}
            >
              View Full Practice History
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions - Two separate blocks with light blue background */}
      <div className="mt-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:bg-blue-100 transition-colors">
            <h3 className="text-xl font-bold mb-2 text-blue-900">Start Practice Session</h3>
            <p className="mb-4 text-blue-700">Jump into a mock interview right now</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleStartPracticeSession}
            >
              Start Now
              <PlayCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:bg-blue-100 transition-colors">
            <h3 className="text-xl font-bold mb-2 text-blue-900">Learn From Experts</h3>
            <p className="mb-4 text-blue-700">Access to our curated interview training resources</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleStartLearning}
            >
              Start Learning
              <BookOpen className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
