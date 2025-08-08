"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight, Users, Briefcase, DollarSign, Palette, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

const categoryQueries = {
  founders: "Tech founders in NYC who raised a pre-seed round",
  engineers: "Software engineers who've worked on growth at a Series A-C company",
  investors: "VCs who invest in early-stage healthcare companies",
  designers: "Product designers at unicorn startups with UX research experience",
  phds: "Stanford PhD students who do research in top labs",
}

const categories = [
  { icon: <Briefcase className="h-4 w-4" />, label: "Founders", color: "text-blue-600", key: "founders" },
  { icon: <Users className="h-4 w-4" />, label: "Engineers", color: "text-orange-600", key: "engineers" },
  { icon: <DollarSign className="h-4 w-4" />, label: "Investors", color: "text-green-600", key: "investors" },
  { icon: <Palette className="h-4 w-4" />, label: "Designers", color: "text-purple-600", key: "designers" },
  { icon: <GraduationCap className="h-4 w-4" />, label: "PhDs", color: "text-red-600", key: "phds" },
]

export function HeroChatbox() {
  const [query, setQuery] = useState("")
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const exampleQueries = Object.values(categoryQueries)

  // Cycle through example queries for placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % exampleQueries.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [exampleQueries.length])

  const handleCategoryClick = (categoryKey: string) => {
    const categoryQuery = categoryQueries[categoryKey as keyof typeof categoryQueries]
    setQuery(categoryQuery)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  const handleSearch = () => {
    if (query.trim()) {
      // Handle search functionality here
      console.log("Searching for:", query)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Enhanced Visual Separation with Decorative Lines */}
      <div className="relative mb-12">
        {/* Top decorative line with gradient */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-xs"></div>
          <div className="mx-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary/30"></div>
            <div className="h-1 w-8 bg-primary/20 rounded-full"></div>
            <div className="h-2 w-2 rounded-full bg-primary/30"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-xs"></div>
        </div>

        {/* Header with enhanced styling */}
        <div className="text-center mb-8">
          <motion.h3
            className="text-2xl md:text-3xl font-light mb-3 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find anyone in your extended network instantly
          </motion.h3>
          <motion.p
            className="text-gray-600 font-light mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Search across 150,000+ professionals through trusted connections — no cold outreach needed.
          </motion.p>
        </div>
      </div>

      {/* Enhanced Search Box - Removed blue lines and adjusted color */}
      <motion.div
        className="bg-gray-100 rounded-3xl border-2 border-gray-300 shadow-xl p-8 mb-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-primary/10"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-secondary/10"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/5"></div>
        </div>

        {/* Removed corner accent elements */}

        <div className="relative z-10">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 focus-within:border-primary focus-within:shadow-md transition-all">
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={exampleQueries[currentExampleIndex]}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-base"
            />
            <Button
              onClick={handleSearch}
              className="rounded-lg px-6 h-10 bg-primary hover:bg-primary/90 flex items-center gap-2 shadow-md"
              disabled={!query.trim()}
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Category Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.label}
            onClick={() => handleCategoryClick(category.key)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          >
            <span className={category.color}>{category.icon}</span>
            <span className="text-gray-700">{category.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Live indicator */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Live network • Updated in real-time</span>
        </div>
      </motion.div>

      {/* Bottom decorative line - same as top */}
      <div className="flex items-center justify-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-xs"></div>
        <div className="mx-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary/30"></div>
          <div className="h-1 w-8 bg-primary/20 rounded-full"></div>
          <div className="h-2 w-2 rounded-full bg-primary/30"></div>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-xs"></div>
      </div>
    </div>
  )
}
