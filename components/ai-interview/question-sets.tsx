"use client"

import { useState, useEffect } from "react"
import { Globe, Building2, Target, GraduationCap, ChevronDown, ChevronUp, Users, BookOpen, Heart, Zap, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

interface QuestionSetData {
  [key: string]: {
    [key: string]: string[] | {
      [key: string]: string[] | {
        [key: string]: string[]
      }
    }
  }
}

export function QuestionSets() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expandedCards, setExpandedCards] = useState<number[]>([])
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set())
  const [questionData, setQuestionData] = useState<QuestionSetData>({})
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [previewCategory, setPreviewCategory] = useState<string>("")
  const [previewSubCategory, setPreviewSubCategory] = useState<string>("")

  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        const response = await fetch('/api/interview/question-sets-data')
        if (response.ok) {
          const data = await response.json()
          setQuestionData(data)
        }
      } catch (error) {
        console.error('Failed to load question data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadQuestionData()
  }, [])

  const toggleCard = (cardId: number) => {
    setExpandedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const toggleSubCategory = (categoryKey: string, subCategory: string) => {
    const key = `${categoryKey}-${subCategory}`
    setExpandedSubCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const isSubCategoryExpanded = (categoryKey: string, subCategory: string) => {
    return expandedSubCategories.has(`${categoryKey}-${subCategory}`)
  }

  const handlePreview = (category: string, subCategory: string) => {
    setPreviewCategory(category)
    setPreviewSubCategory(subCategory)
    setShowPreview(true)
  }

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "General":
        return Globe
      case "By College (VinUni)":
        return GraduationCap
      case "By Competency":
        return Target
      default:
        return Building2
    }
  }

  const getSubCategories = (category: string) => {
    const categoryData = questionData[category]
    if (!categoryData) return []
    
    return Object.keys(categoryData)
  }

  const getSubSubCategories = (category: string, subCategory: string) => {
    const categoryData = questionData[category]
    if (!categoryData || !categoryData[subCategory]) return []
    
    const subCategoryData = categoryData[subCategory]
    if (Array.isArray(subCategoryData)) return []
    
    return Object.keys(subCategoryData)
  }

  const getSubSubSubCategories = (category: string, subCategory: string, subSubCategory: string) => {
    const categoryData = questionData[category]
    if (!categoryData || !categoryData[subCategory]) return []
    
    const subCategoryData = categoryData[subCategory]
    if (Array.isArray(subCategoryData) || !subCategoryData[subSubCategory]) return []
    
    const subSubCategoryData = subCategoryData[subSubCategory]
    if (Array.isArray(subSubCategoryData)) return []
    
    return Object.keys(subSubCategoryData)
  }

  const getQuestionCount = (category: string, subCategory?: string, subSubCategory?: string, subSubSubCategory?: string) => {
    const categoryData = questionData[category]
    if (!categoryData) return 0
    
    if (!subCategory) {
      // Count all questions in category
      let total = 0
      Object.values(categoryData).forEach(subCat => {
        if (Array.isArray(subCat)) {
          total += subCat.length
        } else {
          Object.values(subCat).forEach(subSubCat => {
            if (Array.isArray(subSubCat)) {
              total += subSubCat.length
            } else {
              Object.values(subSubCat).forEach(questions => {
                if (Array.isArray(questions)) {
                  total += questions.length
                }
              })
            }
          })
        }
      })
      return total
    }
    
    const subCategoryData = categoryData[subCategory]
    if (!subCategoryData) return 0
    
    if (Array.isArray(subCategoryData)) {
      return subCategoryData.length
    }
    
    if (!subSubCategory) {
      // Count all questions in subcategory
      let total = 0
      Object.values(subCategoryData).forEach(subSubCat => {
        if (Array.isArray(subSubCat)) {
          total += subSubCat.length
        } else {
          Object.values(subSubCat).forEach(questions => {
            if (Array.isArray(questions)) {
              total += questions.length
            }
          })
        }
      })
      return total
    }
    
    const subSubCategoryData = subCategoryData[subSubCategory]
    if (!subSubCategoryData) return 0
    
    if (Array.isArray(subSubCategoryData)) {
      return subSubCategoryData.length
    }
    
    if (!subSubSubCategory) {
      // Count all questions in subsubcategory
      let total = 0
      Object.values(subSubCategoryData).forEach(questions => {
        if (Array.isArray(questions)) {
          total += questions.length
        }
      })
      return total
    }
    
    const questions = subSubCategoryData[subSubSubCategory]
    return Array.isArray(questions) ? questions.length : 0
  }

  const questionSets = [
    {
      id: 1,
      title: "General",
      description: "Covers 80% of the interview questions you might get.",
      icon: Globe,
      category: "General"
    },
    {
      id: 2,
      title: "By College (VinUni)",
      description: "Questions organized by college and specific programs.",
      icon: GraduationCap,
      category: "By College (VinUni)"
    },
    {
      id: 3,
      title: "By Competency",
      description: "Questions sorted by competency & skillset.",
      icon: Target,
      category: "By Competency"
    },
    {
      id: 4,
      title: "Admission Interview",
      description: "Interview questions by program type and school.",
      icon: GraduationCap,
      category: "Admission Interview"
    }
  ]

  const isExpanded = (cardId: number) => expandedCards.includes(cardId)

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading question sets...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Sets</h1>
        <p className="text-gray-600 text-lg">Browse all our question guides and answers</p>
      </div>

      {/* Question Sets List */}
      <div className="space-y-4">
        {questionSets.map((set) => {
          const IconComponent = getIconForCategory(set.category)
          const subCategories = getSubCategories(set.category)
          const totalQuestions = getQuestionCount(set.category)
          
          return (
            <div key={set.id} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCard(set.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{set.title}</h3>
                      <p className="text-gray-600 mt-1">{set.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">{subCategories.length} categories</span>
                        <span className="text-sm text-gray-500">{totalQuestions} questions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isExpanded(set.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded(set.id) && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {subCategories.map((subCategory) => {
                      const subSubCategories = getSubSubCategories(set.category, subCategory)
                      const subCategoryQuestionCount = getQuestionCount(set.category, subCategory)
                      const isSubExpanded = isSubCategoryExpanded(set.category, subCategory)
                      
                      return (
                        <div key={subCategory} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{subCategory}</h4>
                            {subSubCategories.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSubCategory(set.category, subCategory)
                                }}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                {isSubExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{subCategoryQuestionCount} questions</p>
                          
                          {isSubExpanded && subSubCategories.length > 0 && (
                            <div className="space-y-2 mb-3">
                              {subSubCategories.map((subSubCategory) => {
                                const subSubSubCategories = getSubSubSubCategories(set.category, subCategory, subSubCategory)
                                const subSubCategoryQuestionCount = getQuestionCount(set.category, subCategory, subSubCategory)
                                
                                return (
                                  <div key={subSubCategory} className="ml-4">
                                    <h5 className="text-sm font-medium text-gray-800 mb-1">{subSubCategory}</h5>
                                    <p className="text-xs text-gray-600 mb-2">{subSubCategoryQuestionCount} questions</p>
                                    
                                    {subSubSubCategories.length > 0 && (
                                      <div className="ml-4 space-y-1">
                                        {subSubSubCategories.map((subSubSubCategory) => {
                                          const questionCount = getQuestionCount(set.category, subCategory, subSubCategory, subSubSubCategory)
                                          
                                          return (
                                            <div key={subSubSubCategory} className="flex items-center justify-between">
                                              <span className="text-xs text-gray-700">{subSubSubCategory}</span>
                                              <span className="text-xs text-gray-500">{questionCount} questions</span>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => handlePreview(set.category, subCategory)}
                            >
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                              onClick={() => router.push(`/ai-interview?tab=practice&category=${set.category}`)}
                            >
                              Practice
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Question Preview</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Category and Subcategory Info */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{previewCategory}</h3>
                <p className="text-gray-600">{previewSubCategory}</p>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {(() => {
                  const categoryData = questionData[previewCategory]
                  if (!categoryData) return <p className="text-gray-500">No questions available</p>
                  
                  const subCategoryData = categoryData[previewSubCategory]
                  if (!subCategoryData) return <p className="text-gray-500">No questions available</p>
                  
                  let questions: string[] = []
                  
                  if (Array.isArray(subCategoryData)) {
                    questions = subCategoryData
                  } else {
                    // Handle nested structure
                    Object.values(subCategoryData).forEach(subSubCat => {
                      if (Array.isArray(subSubCat)) {
                        questions.push(...subSubCat)
                      } else {
                        Object.values(subSubCat).forEach(questionsList => {
                          if (Array.isArray(questionsList)) {
                            questions.push(...questionsList)
                          }
                        })
                      }
                    })
                  }
                  
                  return questions.length > 0 ? (
                    <div className="space-y-3">
                      {questions.map((question, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <p className="text-gray-900 leading-relaxed">{question}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No questions available in this category</p>
                  )
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false)
                    router.push(`/ai-interview?tab=practice&category=${previewCategory}`)
                  }}
                >
                  Start Practice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
