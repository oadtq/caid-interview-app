"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, PlayCircle, BookOpen, Award, ArrowRight, CheckCircle, Star, Layers, Video, Target, TrendingUp, MessageSquare, Brain, Users, Zap, BarChart3, Trophy, Eye } from "lucide-react"

interface InterviewHomeProps {
  onTabChange?: (tab: string) => void
}

export function InterviewHome({ onTabChange }: InterviewHomeProps) {
  const userStats = {
    totalSessions: 12,
    averageScore: 85,
    completedLessons: 8,
    totalVideos: 24,
    certificatesEarned: 2,
    practiceTime: "6.5 hours"
  }

  const recentPracticeSessions = [
    { 
      title: "Behavioral Questions Practice", 
      score: 92, 
      date: "2 hours ago", 
      duration: "15 mins",
      questionsAnswered: 5
    },
    { 
      title: "Technical Interview Prep", 
      score: 78, 
      date: "1 day ago", 
      duration: "22 mins",
      questionsAnswered: 7
    },
    { 
      title: "General Interview Questions", 
      score: 88, 
      date: "2 days ago", 
      duration: "18 mins",
      questionsAnswered: 6
    },
  ]

  const curriculumProgress = [
    {
      title: "Interview Foundations",
      progress: 75,
      lessonsCompleted: 3,
      totalLessons: 4,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Common Interview Questions",
      progress: 40,
      lessonsCompleted: 2,
      totalLessons: 5,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Advanced Techniques",
      progress: 20,
      lessonsCompleted: 1,
      totalLessons: 5,
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const quickActions = [
    {
      title: "Start Practice Session",
      description: "Jump into a mock interview with AI feedback",
      icon: PlayCircle,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => onTabChange?.("practice")
    },
    {
      title: "Continue Curriculum",
      description: "Pick up where you left off in your learning",
      icon: BookOpen,
      color: "bg-green-600 hover:bg-green-700",
      action: () => onTabChange?.("curriculum")
    },
    {
      title: "Review My Videos",
      description: "Watch and analyze your practice recordings",
      icon: Video,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => onTabChange?.("videos")
    },
    {
      title: "Browse Question Sets",
      description: "Explore our comprehensive question database",
      icon: Target,
      color: "bg-orange-600 hover:bg-orange-700",
      action: () => onTabChange?.("question-sets")
    }
  ]

  const achievements = [
    {
      title: "First Practice Session",
      description: "Completed your first AI interview practice",
      icon: Star,
      earned: true,
      date: "3 days ago"
    },
    {
      title: "Consistent Learner",
      description: "Completed 5 lessons in a week",
      icon: TrendingUp,
      earned: true,
      date: "1 week ago"
    },
    {
      title: "High Performer",
      description: "Achieved 90%+ score in practice session",
      icon: Trophy,
      earned: false
    },
    {
      title: "Video Master",
      description: "Recorded 10 practice videos",
      icon: Video,
      earned: false
    }
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
        <p className="text-gray-600 text-lg">
          Ready to ace your next interview? Let's continue your preparation journey.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Practice Sessions</p>
                <p className="text-2xl font-bold text-blue-900">{userStats.totalSessions}</p>
              </div>
              <Video className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Avg. Score</p>
                <p className="text-2xl font-bold text-green-900">{userStats.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Lessons Completed</p>
                <p className="text-2xl font-bold text-purple-900">{userStats.completedLessons}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Practice Time</p>
                <p className="text-2xl font-bold text-orange-900">{userStats.practiceTime}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white h-auto p-4 flex flex-col items-start gap-2 text-left`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <action.icon className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Practice Sessions */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Recent Practice Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPracticeSessions.map((session, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{session.title}</h4>
                      <div className="flex items-center gap-1 text-green-600">
                        <Star className="h-3 w-3" />
                        <span className="text-sm font-medium">{session.score}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{session.date}</span>
                      <span>{session.duration} • {session.questionsAnswered} questions</span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => onTabChange?.("videos")}
                >
                  View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Curriculum Progress */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Curriculum Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {curriculumProgress.map((course, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${course.bgColor}`}>
                      <course.icon className={`h-5 w-5 ${course.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">{course.lessonsCompleted}/{course.totalLessons} lessons</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onTabChange?.("curriculum")}
                  >
                    Continue Learning
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.earned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <achievement.icon className={`h-5 w-5 ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.earned && achievement.date && (
                    <div className="text-xs text-green-600 font-medium">{achievement.date}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
