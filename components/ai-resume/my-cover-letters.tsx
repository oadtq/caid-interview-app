"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Download, Eye, Edit, Calendar, Building, Plus, Search, Filter, Loader2, Save, X, Trash2 } from "lucide-react"

interface CoverLetter {
  id: string
  position: string
  company_name: string
  created_at: string
  tone: string
  content: string
  job_description?: string
  resume_data?: string
}

interface MyCoverLettersProps {
  setActiveTab?: (tab: string) => void
}

export function MyCoverLetters({ setActiveTab }: MyCoverLettersProps) {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingLetter, setEditingLetter] = useState<CoverLetter | null>(null)
  const [editContent, setEditContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [previewLetter, setPreviewLetter] = useState<CoverLetter | null>(null)

  useEffect(() => {
    fetchCoverLetters()
  }, [])

  const fetchCoverLetters = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cover-letter/list')
      if (!response.ok) {
        throw new Error('Failed to fetch cover letters')
      }
      const data = await response.json()
      setCoverLetters(data.coverLetters || [])
    } catch (error) {
      console.error('Error fetching cover letters:', error)
      setError('Failed to load cover letters')
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToGenerate = () => {
    if (setActiveTab) {
      setActiveTab('generate-cover-letter')
    }
  }

  const handleEdit = (letter: CoverLetter) => {
    setEditingLetter(letter)
    setEditContent(letter.content)
  }

  const handleSave = async () => {
    if (!editingLetter) return

    try {
      setSaving(true)
      const response = await fetch('/api/cover-letter/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingLetter.id,
          content: editContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update cover letter')
      }

      // Update the local state
      setCoverLetters(prev => 
        prev.map(letter => 
          letter.id === editingLetter.id 
            ? { ...letter, content: editContent }
            : letter
        )
      )

      setEditingLetter(null)
      setEditContent("")
    } catch (error) {
      console.error('Error saving cover letter:', error)
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = (letter: CoverLetter) => {
    setPreviewLetter(letter)
  }

  const handleDownload = (letter: CoverLetter) => {
    const element = document.createElement("a")
    const file = new Blob([letter.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${letter.company_name}_${letter.position}_cover_letter.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDelete = async (letterId: string) => {
    if (!confirm('Are you sure you want to delete this cover letter? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/cover-letter/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: letterId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete cover letter')
      }

      // Remove the cover letter from the local state
      setCoverLetters(prev => prev.filter(letter => letter.id !== letterId))
    } catch (error) {
      console.error('Error deleting cover letter:', error)
      setError('Failed to delete cover letter. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Final" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getWordCount = (content: string) => {
    return content.split(/\s+/).length
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading cover letters...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCoverLetters} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="mb-8 text-left">
          <h1 className="text-3xl text-gray-900 mb-4 font-medium text-center">My Cover Letters</h1>
          <p className="text-gray-600 text-lg text-center">Manage and organize your AI-generated cover letters</p>
        </div>

        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cover letters..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Status</option>
                      <option>Draft</option>
                      <option>Final</option>
                    </select>
                  </div>
                </div>
                {/* <Button 
                  onClick={handleNavigateToGenerate}
                  className="bg-[#114ef7] hover:bg-[#0f46d1] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Cover Letter
                </Button> */}
              </div>
            </div>
          </Card3D>
        </motion.div>

        {/* Cover Letters List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {coverLetters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card3D>
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{letter.position}</h3>
                          <Badge className="bg-blue-100 text-blue-700">Final</Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <Building className="h-4 w-4" />
                          <span>{letter.company_name}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(letter.created_at)}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>{getWordCount(letter.content)} words</span>
                          <span>•</span>
                          <span>{letter.tone} tone</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(letter)}
                        className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(letter)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(letter)}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(letter.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {coverLetters.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card3D>
              <div className="bg-white rounded-xl border border-gray-100 p-12 shadow-sm text-center">
                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4">
                  <Mail className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No cover letters yet</h3>
                <p className="text-gray-600 mb-6">Create your first AI-generated cover letter to get started</p>
                <Button 
                  onClick={handleNavigateToGenerate}
                  className="bg-[#114ef7] hover:bg-[#0f46d1] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Cover Letter
                </Button>
              </div>
            </Card3D>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Card3D>
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to create your next cover letter?</h3>
              {/* <p className="text-gray-600 mb-6">Generate personalized cover letters tailored to your target role and company</p> */}
              {/* <Button 
                onClick={handleNavigateToGenerate}
                className="bg-[#114ef7] hover:bg-[#0f46d1] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Cover Letter
              </Button> */}
            </div>
          </Card3D>
        </motion.div>
      </motion.div>

      {/* Edit Modal */}
      {editingLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Cover Letter - {editingLetter.position} at {editingLetter.company_name}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingLetter(null)
                    setEditContent("")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[400px] resize-none font-mono text-sm"
                placeholder="Edit your cover letter content..."
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingLetter(null)
                  setEditContent("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Preview - {previewLetter.position} at {previewLetter.company_name}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewLetter(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {previewLetter.content}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => handleDownload(previewLetter)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => {
                  setPreviewLetter(null)
                  handleEdit(previewLetter)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
