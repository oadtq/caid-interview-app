"use client"

import { useState } from "react"
import { LogOut, User, ChevronDown, ArrowLeft, BookOpen, MessageSquare, Award } from 'lucide-react'

interface InterviewHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  userInfo: {
    firstName: string
    lastName: string
    email: string
    studentId: string
  }
}

export function InterviewHeader({ activeTab, onTabChange, onLogout, userInfo }: InterviewHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCurriculumDropdown, setShowCurriculumDropdown] = useState(false)

  const tabs = [
    { id: "home", label: "Interview Home" },
    {
      id: "curriculum",
      label: "Interview Curriculum",
      hasDropdown: true,
      dropdownItems: [
        {
          id: "curriculum",
          label: "Interview Curriculum",
          description: "Learn how to land and keep your dream job",
          icon: BookOpen,
        },
        {
          id: "question-sets",
          label: "Question Sets",
          description: "Browse all our question guides and answers",
          icon: MessageSquare,
        },
        {
          id: "certificates",
          label: "Certificates",
          description: "View earned certificates",
          icon: Award,
        },
      ],
    },
    { id: "practice", label: "Practice" },
    { id: "videos", label: "My Videos" },
  ]

  const handleBackToDashboard = () => {
    window.location.href = "/dashboard"
  }

  const handleTabClick = (tab: any) => {
    if (tab.hasDropdown) {
      setShowCurriculumDropdown(!showCurriculumDropdown)
    } else {
      onTabChange(tab.id)
      setShowCurriculumDropdown(false)
    }
  }

  const handleDropdownItemClick = (itemId: string) => {
    onTabChange(itemId)
    setShowCurriculumDropdown(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo and Navigation */}
        <div className="flex items-center">
          {/* Back Button */}
          <button onClick={handleBackToDashboard} className="mr-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>

          {/* Logo */}
          <div className="font-bold text-lg mr-6">
            <span className="gradient-text">AI Interview</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative">
                <button
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors relative flex items-center gap-1 ${
                    activeTab === tab.id ||
                    (
                      tab.hasDropdown &&
                        (activeTab === "curriculum" || activeTab === "question-sets" || activeTab === "certificates")
                    )
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                  {tab.hasDropdown && (
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${showCurriculumDropdown ? "rotate-180" : ""}`}
                    />
                  )}
                  {(activeTab === tab.id ||
                    (tab.hasDropdown &&
                      (activeTab === "curriculum" ||
                        activeTab === "question-sets" ||
                        activeTab === "certificates"))) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {tab.hasDropdown && showCurriculumDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50">
                    {tab.dropdownItems?.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleDropdownItemClick(item.id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
                      >
                        <div
                          className={`p-2 rounded-lg mt-1 ${item.id === "certificates" ? "bg-blue-50" : "bg-blue-50"}`}
                        >
                          <item.icon
                            className={`h-5 w-5 ${item.id === "certificates" ? "text-blue-600" : "text-blue-600"}`}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 mb-1">{item.label}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {userInfo.firstName} {userInfo.lastName}
                </div>
                <div className="text-xs text-gray-500">{userInfo.studentId}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-medium text-gray-900">
                    {userInfo.firstName} {userInfo.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{userInfo.email}</div>
                  <div className="text-xs text-gray-400 mt-1">ID: {userInfo.studentId}</div>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-100 px-6 py-2">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab.id ||
                (
                  tab.hasDropdown &&
                    (activeTab === "curriculum" || activeTab === "question-sets" || activeTab === "certificates")
                )
                  ? "text-primary bg-primary/10"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
