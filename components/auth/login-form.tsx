"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string }) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onLogin(credentials)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 enhanced-dots-pattern opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 filter blur-[100px] opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 filter blur-[100px] opacity-60"></div>

      <motion.div
        className="w-full max-w-md mx-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 relative overflow-hidden">
          {/* Header accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

          <div className="text-center mb-8">
            <div className="font-bold text-2xl mb-2">
              <span className="gradient-text">EveryMatch</span>
              <span className="text-gray-900">.ai</span>
            </div>
            <h1 className="text-xl font-light text-gray-900 mb-2">Student Portal</h1>
            <p className="text-gray-600 text-sm font-light">Sign in to practice AI interviews and get resume reviews
</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 block">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                    className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !credentials.username || !credentials.password}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center">
              <a href="#" className="text-sm text-primary hover:text-primary/80 font-medium">
                Forgot your password?
              </a>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact{" "}
              <a href="mailto:support@everymatch.ai" className="text-primary hover:text-primary/80">
                support@everymatch.ai
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
