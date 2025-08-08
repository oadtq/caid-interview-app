"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, PlayCircle, BookOpen, Award, ArrowRight, CheckCircle, Star, Layers } from "lucide-react"

export function InterviewHome() {
  const recommendedTasks = [
    {
      title: "Practice Sets",
      description: "Complete mock interview practice sessions",
      type: "assignment",
      priority: "high",
      estimatedTime: "30 mins",
      icon: Layers,
    },
    {
      title: "Marketing (General) Track",
      description: "Specialized questions for your field",
      type: "track",
      priority: "medium",
      estimatedTime: "45 mins",
      icon: BookOpen,
    },
    {
      title: "Mastery Track Progress",
      description: "Continue your comprehensive preparation",
      type: "course",
      priority: "low",
      estimatedTime: "60 mins",
      icon: Award,
    },
  ]

  const recentActivity = [
    { action: "Completed Mock Interview", time: "2 hours ago", score: 85 },
    { action: "Watched Fast Track Video #12", time: "1 day ago", score: null },
    { action: "Practiced Behavioral Questions", time: "2 days ago", score: 92 },
    { action: "Finished Behavioral Assessment", time: "3 days ago", score: 78 },
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

      <div className="grid gap-8">
        {/* Recommended Tasks */}
        <div className="h-full">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended for You</h2>

            <div className="space-y-4 flex-1">
              {recommendedTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      task.priority === "high"
                        ? "bg-red-50"
                        : task.priority === "medium"
                          ? "bg-yellow-50"
                          : "bg-blue-50"
                    }`}
                  >
                    <task.icon
                      className={`h-5 w-5 ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
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
              ))}
            </div>

            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 h-12 text-base font-medium rounded-lg">
              View All Recommendations
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="h-full">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

            <div className="space-y-4 flex-1">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
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
              ))}
            </div>

            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 h-12 text-base font-medium rounded-lg">
              View Full Activity Log
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Now
              <PlayCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:bg-blue-100 transition-colors">
            <h3 className="text-xl font-bold mb-2 text-blue-900">Continue Learning</h3>
            <p className="mb-4 text-blue-700">Pick up where you left off in your curriculum</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Continue
              <BookOpen className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
