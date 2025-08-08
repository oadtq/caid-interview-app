"use client"

import { motion } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Download, Eye, Edit, Calendar, Building, Plus, Search, Filter } from "lucide-react"

export function MyCoverLetters() {
  const coverLetters = [
    {
      id: "1",
      jobTitle: "Senior Software Engineer",
      company: "Google",
      createdDate: "2024-01-15",
      status: "Draft",
      wordCount: 342,
      tone: "Professional",
      industry: "Technology",
    },
    {
      id: "2",
      jobTitle: "Product Manager",
      company: "Meta",
      createdDate: "2024-01-12",
      status: "Final",
      wordCount: 298,
      tone: "Enthusiastic",
      industry: "Technology",
    },
    {
      id: "3",
      jobTitle: "Data Scientist",
      company: "Microsoft",
      createdDate: "2024-01-08",
      status: "Final",
      wordCount: 315,
      tone: "Confident",
      industry: "Technology",
    },
    {
      id: "4",
      jobTitle: "UX Designer",
      company: "Apple",
      createdDate: "2024-01-05",
      status: "Draft",
      wordCount: 287,
      tone: "Creative",
      industry: "Design",
    },
  ]

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
                <Button className="bg-[#114ef7] hover:bg-[#0f46d1] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Cover Letter
                </Button>
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
                          <h3 className="text-lg font-semibold text-gray-900">{letter.jobTitle}</h3>
                          <Badge className={getStatusColor(letter.status)}>{letter.status}</Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <Building className="h-4 w-4" />
                          <span>{letter.company}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(letter.createdDate)}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>{letter.wordCount} words</span>
                          <span>•</span>
                          <span>{letter.tone} tone</span>
                          <span>•</span>
                          <span>{letter.industry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State or Load More */}
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
                <Button className="bg-[#114ef7] hover:bg-[#0f46d1] text-white">
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
          <Card3D></Card3D>
        </motion.div>
      </motion.div>
    </div>
  )
}
