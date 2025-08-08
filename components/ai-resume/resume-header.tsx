"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, LogOut, User, ArrowLeft, FileText, Scan, Mail } from 'lucide-react'

interface ResumeHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  userInfo: {
    firstName: string
    lastName: string
    studentId: string
    email: string
  }
}

export function ResumeHeader({ activeTab, onTabChange, onLogout, userInfo }: ResumeHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showScanDropdown, setShowScanDropdown] = useState(false)
  const [showCoverLettersDropdown, setShowCoverLettersDropdown] = useState(false)

  const tabs = [
    { id: "home", label: "Resume Home" },
    {
      id: "scan",
      label: "Scan",
      hasDropdown: true,
      dropdownItems: [
        {
          id: "resume-ai",
          label: "ResumeAI",
          description: "Scan your resume and get AI feedback",
          icon: Scan,
        },
        {
          id: "my-scans",
          label: "My Scans",
          description: "Review recent scans and feedback",
          icon: FileText,
        },
      ],
    },
    { id: "curriculum", label: "Resume Curriculum" },
    { id: "resume-builder", label: "Resume Builder" },
    { id: "templates", label: "Resume Template" },
    {
      id: "cover-letters",
      label: "Cover Letters",
      hasDropdown: true,
      dropdownItems: [
        {
          id: "generate-cover-letter",
          label: "Generate Cover Letter",
          description: "AI-generated cover letters",
          icon: Mail,
        },
        {
          id: "my-cover-letters",
          label: "My Cover Letters",
          description: "Manage saved cover letters",
          icon: FileText,
        },
      ],
    },
  ]

  const handleBackToDashboard = () => {
    window.location.href = "/"
  }

  const handleTabClick = (tab: any) => {
    if (tab.hasDropdown) {
      if (tab.id === "scan") {
        setShowScanDropdown(!showScanDropdown)
        setShowCoverLettersDropdown(false)
      } else if (tab.id === "cover-letters") {
        setShowCoverLettersDropdown(!showCoverLettersDropdown)
        setShowScanDropdown(false)
      }
    } else {
      onTabChange(tab.id)
      setShowScanDropdown(false)
      setShowCoverLettersDropdown(false)
    }
  }

  const handleDropdownItemClick = (itemId: string) => {
    onTabChange(itemId)
    setShowScanDropdown(false)
    setShowCoverLettersDropdown(false)
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
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">AI Resume</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative">
                <button
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors relative flex items-center gap-1 hover:bg-gray-50 ${
                    activeTab === tab.id ||
                    (
                      tab.hasDropdown &&
                        ((tab.id === "scan" && (activeTab === "resume-ai" || activeTab === "my-scans")) ||
                          (tab.id === "cover-letters" &&
                            (activeTab === "generate-cover-letter" || activeTab === "my-cover-letters")))
                    )
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  aria-expanded={tab.hasDropdown ? (
                    (tab.id === "scan" && showScanDropdown) ||
                    (tab.id === "cover-letters" && showCoverLettersDropdown)
                  ) : undefined}
                >
                  {tab.label}
                  {tab.hasDropdown && (
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        (tab.id === "scan" && showScanDropdown) ||
                        (tab.id === "cover-letters" && showCoverLettersDropdown)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  )}
                  {(activeTab === tab.id ||
                    (tab.hasDropdown &&
                      ((tab.id === "scan" && (activeTab === "resume-ai" || activeTab === "my-scans")) ||
                        (tab.id === "cover-letters" &&
                          (activeTab === "generate-cover-letter" || activeTab === "my-cover-letters"))))) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {tab.hasDropdown &&
                  ((tab.id === "scan" && showScanDropdown) ||
                    (tab.id === "cover-letters" && showCoverLettersDropdown)) && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50">
                      {tab.dropdownItems?.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleDropdownItemClick(item.id)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
                        >
                          <div className="p-2 rounded-lg mt-1 bg-blue-50">
                            <item.icon className="h-5 w-5 text-blue-600" />
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
          <Badge variant="secondary" className="hidden sm:inline-flex bg-blue-100 text-blue-700">
            Student
          </Badge>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                <User className="h-4 w-4 text-blue-600" />
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
                    ((tab.id === "scan" && (activeTab === "resume-ai" || activeTab === "my-scans")) ||
                      (tab.id === "cover-letters" &&
                        (activeTab === "generate-cover-letter" || activeTab === "my-cover-letters")))
                )
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
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
