"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Edit, CheckCircle, Lightbulb, Save, Undo, Copy, FileText } from "lucide-react"

interface EditImproveProps {
  feedbackData: any
}

export function EditImprove({ feedbackData }: EditImproveProps) {
  const [editedSections, setEditedSections] = useState<{ [key: string]: string }>({})
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([])

  const suggestions = [
    {
      id: "1",
      type: "Grammar",
      original: "Responsible for managing team of 5 developers",
      improved: "Managed a team of 5 developers",
      explanation: "Use active voice and add article 'a'",
    },
    {
      id: "2",
      type: "Keywords",
      original: "Built web applications",
      improved: "Developed responsive web applications using React, Node.js, and MongoDB",
      explanation: "Add specific technologies and keywords",
    },
    {
      id: "3",
      type: "Quantification",
      original: "Improved system performance",
      improved: "Improved system performance by 40% through database optimization",
      explanation: "Add specific metrics and methods",
    },
    {
      id: "4",
      type: "Formatting",
      original: "• Led project\n• Managed team\n• Delivered results",
      improved:
        "• Led cross-functional project teams of 8+ members\n• Managed development team through agile methodologies\n• Delivered projects 15% ahead of schedule",
      explanation: "Make bullet points more specific and impactful",
    },
  ]

  const applySuggestion = (suggestionId: string) => {
    setAppliedSuggestions([...appliedSuggestions, suggestionId])
  }

  const revertSuggestion = (suggestionId: string) => {
    setAppliedSuggestions(appliedSuggestions.filter((id) => id !== suggestionId))
  }

  const handleSectionEdit = (section: string, content: string) => {
    setEditedSections({
      ...editedSections,
      [section]: content,
    })
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-8">
          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-full w-20 h-20 mx-auto mb-6">
            <Edit className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit & Improve</h1>
          <p className="text-gray-600 text-lg">Apply AI suggestions to improve your resume content</p>
        </div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Improvement Suggestions</h2>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <Card3D>
                  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <Lightbulb className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {suggestion.type}
                          </Badge>
                          <p className="text-sm text-gray-600">{suggestion.explanation}</p>
                        </div>
                      </div>
                      {appliedSuggestions.includes(suggestion.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revertSuggestion(suggestion.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Undo className="h-4 w-4 mr-1" />
                          Revert
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion.id)}
                          className="bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Apply
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Original:</p>
                        <div
                          className={`p-3 rounded-lg border text-sm ${
                            appliedSuggestions.includes(suggestion.id)
                              ? "bg-red-50 border-red-200 line-through text-red-600"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          {suggestion.original}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Improved:</p>
                        <div
                          className={`p-3 rounded-lg border text-sm ${
                            appliedSuggestions.includes(suggestion.id)
                              ? "bg-green-50 border-green-200 text-green-700"
                              : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          {suggestion.improved}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Manual Editing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manual Editing</h2>
          <div className="space-y-6">
            {["Professional Summary", "Work Experience", "Skills", "Education"].map((section, index) => (
              <Card3D key={section}>
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{section}</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Undo className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder={`Edit your ${section.toLowerCase()} here...`}
                    className="min-h-[120px] resize-none"
                    value={editedSections[section] || `Sample ${section.toLowerCase()} content...`}
                    onChange={(e) => handleSectionEdit(section, e.target.value)}
                  />
                </div>
              </Card3D>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Preview Resume
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
