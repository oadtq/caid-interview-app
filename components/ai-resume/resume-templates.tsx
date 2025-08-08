"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Star, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from "next/image"

export function ResumeTemplates() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const [visibleTemplates, setVisibleTemplates] = useState(6)

  const categories = [
    { id: "all", name: "All Templates", count: 12 },
    { id: "modern", name: "Modern", count: 4 },
    { id: "classic", name: "Classic", count: 3 },
    { id: "creative", name: "Creative", count: 3 },
    { id: "minimal", name: "Minimal", count: 2 }
  ]

  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      category: "modern",
      image: "/images/resume-template-1.png",
      rating: 4.8,
      downloads: 1250,
      description: "Clean and modern design perfect for tech professionals and creative roles.",
      features: ["ATS-Friendly", "Modern Design", "Easy to Edit"]
    },
    {
      id: 2,
      name: "Executive Classic",
      category: "classic", 
      image: "/images/resume-template-2.png",
      rating: 4.9,
      downloads: 980,
      description: "Traditional format ideal for senior executives and corporate positions.",
      features: ["Professional", "Traditional", "Executive Level"]
    },
    {
      id: 3,
      name: "Creative Portfolio",
      category: "creative",
      image: "/images/resume-template-3.png", 
      rating: 4.7,
      downloads: 750,
      description: "Eye-catching design for designers, marketers, and creative professionals.",
      features: ["Creative Design", "Portfolio Style", "Visual Appeal"]
    },
    {
      id: 4,
      name: "Minimal Clean",
      category: "minimal",
      image: "/images/resume-template-4.png",
      rating: 4.6,
      downloads: 650,
      description: "Simple and clean layout that focuses on content over design.",
      features: ["Minimal Design", "Content Focus", "Clean Layout"]
    },
    {
      id: 5,
      name: "Tech Specialist",
      category: "modern",
      image: "/images/resume-template-5.png",
      rating: 4.8,
      downloads: 890,
      description: "Designed specifically for software engineers and tech professionals.",
      features: ["Tech-Focused", "Skills Highlight", "Modern"]
    },
    {
      id: 6,
      name: "Business Professional",
      category: "classic",
      image: "/images/resume-template-6.png",
      rating: 4.7,
      downloads: 720,
      description: "Perfect for business analysts, consultants, and finance professionals.",
      features: ["Business Style", "Professional", "Corporate"]
    }
  ]

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const handleDownload = (template: any) => {
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = template.image
    link.download = `${template.name.replace(/\s+/g, '_')}_Resume_Template.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadMoreTemplates = () => {
    setVisibleTemplates(prev => prev + 6)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl text-gray-900 mb-4 font-medium">Resume Templates</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose from our collection of professionally designed resume templates
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredTemplates.slice(0, visibleTemplates).map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card3D>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
                      <Image
                        src={template.image || "/placeholder.svg"}
                        alt={template.name}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setPreviewTemplate(template)}
                          className="bg-white hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(template)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{template.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{template.downloads} downloads</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(template)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleTemplates < filteredTemplates.length && (
          <div className="text-center">
            <Button
              onClick={loadMoreTemplates}
              variant="outline"
              className="px-8 py-3"
            >
              Load More Templates
            </Button>
          </div>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {previewTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setPreviewTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{previewTemplate.name}</h2>
                    <p className="text-gray-600">{previewTemplate.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6">
                  <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-6">
                    <Image
                      src={previewTemplate.image || "/placeholder.svg"}
                      alt={previewTemplate.name}
                      width={600}
                      height={800}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{previewTemplate.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{previewTemplate.downloads} downloads</span>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setPreviewTemplate(null)}
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          handleDownload(previewTemplate)
                          setPreviewTemplate(null)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
