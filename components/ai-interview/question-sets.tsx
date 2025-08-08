"use client"

import { useState } from "react"
import { Globe, Building2, Target, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function QuestionSets() {
  const [expandedCards, setExpandedCards] = useState<number[]>([])

  const toggleCard = (cardId: number) => {
    setExpandedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const questionSets = [
    {
      id: 1,
      title: "General",
      description: "Covers 80% of the interview questions you might get.",
      icon: Globe,
      subCategories: [
        "Career Change",
        "Elevator Pitch",
        "Entry Level",
        "Internship",
        "Managerial Role",
        "Mid Level",
        "Senior Level",
        "Top 10 Questions",
        "Uncomfortable Questions",
      ],
    },
    {
      id: 2,
      title: "By Industry",
      description: "Start practicing mock interviews in hundreds of industries and job titles.",
      icon: Building2,
      subCategories: [
        "Technology & Software",
        "Healthcare & Medical",
        "Finance & Banking",
        "Marketing & Advertising",
        "Consulting",
        "Education",
        "Retail & E-commerce",
        "Manufacturing",
        "Non-Profit",
      ],
    },
    {
      id: 3,
      title: "By Competency",
      description: "Questions sorted by competency & skillset.",
      icon: Target,
      subCategories: [
        "Leadership & Management",
        "Problem Solving",
        "Communication Skills",
        "Teamwork & Collaboration",
        "Analytical Thinking",
        "Customer Service",
        "Project Management",
        "Technical Skills",
        "Adaptability",
      ],
    },
    {
      id: 4,
      title: "Admissions Interview",
      description: "Interview questions by program type and school.",
      icon: GraduationCap,
      subCategories: [
        "MBA Programs",
        "Medical School",
        "Law School",
        "Graduate Programs",
        "Undergraduate",
        "PhD Programs",
        "Business School",
        "Engineering Programs",
        "International Programs",
      ],
    },
  ]

  const isExpanded = (cardId: number) => expandedCards.includes(cardId)

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Sets</h1>
        <p className="text-gray-600 text-lg">Browse all our question guides and answers</p>
      </div>

      {/* Question Sets List */}
      <div className="space-y-4">
        {questionSets.map((set) => (
          <div
            key={set.id}
            className="bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all overflow-hidden"
          >
            {/* Main Card Header */}
            <div className="p-6 cursor-pointer" onClick={() => toggleCard(set.id)}>
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-full">
                  <set.icon className="h-6 w-6 text-blue-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{set.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{set.description}</p>
                </div>

                {/* Expand/Collapse Icon */}
                <div className="flex-shrink-0">
                  <div className="p-2">
                    {isExpanded(set.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Content */}
            {isExpanded(set.id) && (
              <div className="px-6 pb-6">
                <div className="ml-14">
                  {/* Sub-categories */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Sub-Categories</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {set.subCategories.map((subCategory, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                        >
                          {subCategory}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    ➤ Practice with These Questions
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom spacing */}
      <div className="mt-12"></div>
    </div>
  )
}
