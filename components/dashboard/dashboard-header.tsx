"use client"

import { useState } from "react"
import { LogOut, User, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DashboardHeaderProps {
  onLogout: () => void
  userInfo: {
    firstName: string
    lastName: string
    email: string
    studentId: string
  }
}

export function DashboardHeader({ onLogout, userInfo }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="font-bold text-lg">
          <span className="gradient-text">EveryMatch</span>
          <span className="text-gray-900">.ai</span>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* User Menu */}
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

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-medium text-gray-900">
                      {userInfo.firstName} {userInfo.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{userInfo.email}</div>
                    <div className="text-xs text-gray-400 mt-1">ID: {userInfo.studentId}</div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
