"use client"

import { useState } from "react"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, FileText, TrendingUp, Clock, Star, ArrowRight, Video, Brain, Target, Award } from "lucide-react"

export function FeatureSelectionDashboard() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const features = [
    {
      id: "ai-interview",
      title: "AI Interview",
      description: "Practice mock interviews with AI-powered feedback and personalized coaching",
      icon: MessageSquare,
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      stats: [
        { label: "Practice Sessions", value: "Unlimited", icon: Video },
        { label: "AI Feedback", value: "Real-time", icon: Brain },
        { label: "Success Rate", value: "94%", icon: Target },
      ],
      features: [
        "Live webcam simulation",
        "Video lessons & certificates",
        "Curated question bank",
        "AI-powered feedback analysis",
        "Video review & sharing",
      ],
      route: "/ai-interview",
    },
    {
      id: "ai-resume",
      title: "AI Resume",
      description: "Get comprehensive AI-generated resume reviews and improvement suggestions",
      icon: FileText,
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      stats: [
        { label: "Review Time", value: "< 2 mins", icon: Clock },
        { label: "Improvement", value: "85%", icon: TrendingUp },
        { label: "Success Rate", value: "92%", icon: Award },
      ],
      features: [
        "Comprehensive feedback analysis",
        "Grammar & formatting check",
        "Keyword optimization",
        "Version history tracking",
        "Easy sharing options",
      ],
      route: "/ai-resume",
    },
  ]

  const handleFeatureSelect = (route: string) => {
    window.location.href = route
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div>
          <h1 className="text-4xl mb-4 font-medium">
            Welcome to <span className="gradient-text">EveryMatch</span>
            <span className="text-gray-900">.ai</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your path to career success with AI-powered interview practice and resume optimization
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={feature.id}>
            <Card3D className="h-full">
              <div
                className={`relative overflow-hidden rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} p-8 h-full`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl text-gray-900 font-medium">{feature.title}</h3>
                      <Badge variant="secondary" className="mt-1">
                        <Star className="h-3 w-3 mr-1" />
                        New Feature
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{feature.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <div className="flex justify-center mb-2">
                        <stat.icon className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="text-lg text-gray-900 font-medium">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Features List */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-gray-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleFeatureSelect(feature.route)}
                  className={`w-full h-12 bg-gradient-to-r ${feature.color} hover:opacity-90 text-white font-medium flex items-center justify-center gap-2 shadow-lg`}
                >
                  Get Started with {feature.title}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="enhanced-dots-pattern w-full h-full"></div>
                </div>
              </div>
            </Card3D>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Need help choosing? Both features work together to maximize your career success.
        </p>
        <div className="text-sm text-gray-500">
          Questions? Contact{" "}
          <a href="mailto:support@everymatch.ai" className="text-primary hover:text-primary/80">
            support@everymatch.ai
          </a>
        </div>
      </div>
    </div>
  )
}
