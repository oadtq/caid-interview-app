"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, User, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface Mentor {
  id?: number
  name?: string
  firstName?: string
  lastName?: string
  title?: string
  currentRole?: string
  company?: string
  employer?: string
  industry?: string
  expertise?: string[]
  functionalExpertise?: string[]
  yearsExperience?: number
  shortBio?: string
  linkedinUrl?: string
  avatar?: string
}

interface MentorProfileSidebarProps {
  mentor: Mentor | null
  isOpen: boolean
  onClose: () => void
}

export function MentorProfileSidebar({ mentor, isOpen, onClose }: MentorProfileSidebarProps) {
  if (!mentor || !isOpen) return null

  // Handle both old and new mentor data structures
  const firstName = mentor.firstName || mentor.name?.split(" ")[0] || ""
  const lastName = mentor.lastName || mentor.name?.split(" ").slice(1).join(" ") || ""
  const currentRole = mentor.currentRole || mentor.title || ""
  const employer = mentor.employer || mentor.company || ""
  const expertise = mentor.functionalExpertise || mentor.expertise || []

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sidebar */}
      <motion.div
        className="relative w-full max-w-md h-full bg-white shadow-xl overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Mentor Profile</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                {firstName} {lastName}
              </h3>
              <p className="text-gray-600 mt-1">{currentRole}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Role</h4>
                <p className="text-gray-900">{currentRole}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Employer</h4>
                <p className="text-gray-900">{employer}</p>
              </div>

              {mentor.industry && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Industry</h4>
                  <p className="text-gray-900">{mentor.industry}</p>
                </div>
              )}

              {mentor.yearsExperience && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Years of Experience</h4>
                  <p className="text-gray-900">{mentor.yearsExperience} years</p>
                </div>
              )}

              {expertise.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Functional Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill) => (
                      <Badge
                        key={skill}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20 border"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {mentor.shortBio && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Professional Biography</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{mentor.shortBio}</p>
                </div>
              )}

              {mentor.linkedinUrl && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</h4>
                  <a
                    href={mentor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View LinkedIn Profile
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg">
                Request Mentorship
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
