"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

interface NavItem {
  label: string
  ref: React.RefObject<HTMLElement>
}

interface Header3DProps {
  navItems: NavItem[]
  scrollToSection: (ref: React.RefObject<HTMLElement>) => void
}

export function Header3D({ navItems, scrollToSection }: Header3DProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { scrollY } = useScroll()

  // Transform header based on scroll
  const headerOpacity = useTransform(scrollY, [0, 100], [0.9, 1])
  const headerBlur = useTransform(scrollY, [0, 100], [8, 12])
  const headerShadow = useTransform(scrollY, [0, 100], [0, 1])

  // Logo animation
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9])
  const logoRotateY = useTransform(scrollY, [0, 100], [0, 5])

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      navItems.forEach((item) => {
        if (item.ref.current) {
          const element = item.ref.current
          const offsetTop = element.offsetTop
          const height = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(item.label)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [navItems])

  return (
    <motion.header
      className="sticky top-0 z-40 w-full"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: `blur(${headerBlur}px)`,
        opacity: headerOpacity,
        boxShadow: useTransform(headerShadow, (value) => `0 4px 20px rgba(0, 0, 0, ${value * 0.1})`),
      }}
    >
      <div className="container mx-auto flex h-20 items-center justify-between">
        <motion.div className="flex items-center gap-2 perspective-container" style={{ scale: logoScale }}>
          <motion.div className="font-bold text-xl transform-3d" style={{ rotateY: logoRotateY }}>
            <span className="gradient-text">EveryMatch</span>
            <span className="text-gray-900">.ai</span>
          </motion.div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.ref)}
              className={`text-sm font-medium transition-colors relative group perspective-container ${
                activeSection === item.label ? "text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              <motion.span className="transform-3d inline-block" whileHover={{ rotateX: 5, rotateY: 5, z: 10 }}>
                {item.label}
              </motion.span>
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  activeSection === item.label ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button className="button-3d rounded-lg text-sm h-10 px-5 shadow-md flex items-center gap-2 bg-primary hover:bg-primary/90">
            Contact Us <ArrowUpRight className="h-4 w-4" />
          </Button>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden border-b border-gray-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="container mx-auto py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  scrollToSection(item.ref)
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === item.label
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button className="w-full rounded-lg text-sm mt-2 flex items-center justify-center gap-2">
              Contact Us <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
