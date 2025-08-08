"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Edit, Save, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

interface User {
  firstName: string
  lastName: string
  studentId: string
  email: string
  degreeProgram: string
  academicYear: string
  major: string
  minor: string
  mentoringAreas: string[]
  biography: string
  cvFile?: File
}

interface ProfileTabProps {
  profileData: User
  onProfileUpdate: (data: User) => void
}

export function ProfileTab({ profileData, onProfileUpdate }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<User>(profileData)
  const [cvFile, setCvFile] = useState<File | null>(formData.cvFile || null)

  const handleSave = () => {
    const updatedData = { ...formData, cvFile: cvFile || undefined }
    onProfileUpdate(updatedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profileData)
    setCvFile(profileData.cvFile || null)
    setIsEditing(false)
  }

  const handleReset = () => {
    const resetData: User = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      studentId: profileData.studentId,
      email: profileData.email,
      degreeProgram: "",
      academicYear: "",
      major: "",
      minor: "",
      mentoringAreas: [],
      biography: "",
    }
    setFormData(resetData)
    setCvFile(null)
    onProfileUpdate(resetData)
    setIsEditing(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setCvFile(file)
    }
  }

  const removeFile = () => {
    setCvFile(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600 font-light">Manage your profile information and upload your CV</p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90 text-white">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Profile
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* CV Upload Section */}
      <motion.div
        className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-medium text-gray-900">CV Upload</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-4">
            {!cvFile ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Upload your CV</p>
                  <p className="text-xs text-gray-500">PDF files only, max 10MB</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!isEditing}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">{cvFile.name}</p>
                    <p className="text-xs text-green-600">
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                    </p>
                  </div>
                </div>
                {isEditing && (
                  <Button onClick={removeFile} size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </motion.div>
    </div>
  )
}
