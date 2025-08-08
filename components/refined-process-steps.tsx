"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProcessStep {
  id: number
  title: string
  duration: string
  icon: React.ReactNode
  description: string
  image: string
  alt: string
}

interface RefinedProcessStepsProps {
  steps: ProcessStep[]
}

export function RefinedProcessSteps({ steps }: RefinedProcessStepsProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle step navigation
  const goToStep = (stepId: number) => {
    if (stepId < 1) {
      setActiveStep(steps.length)
    } else if (stepId > steps.length) {
      setActiveStep(1)
    } else {
      setActiveStep(stepId)
    }

    // Pause autoplay temporarily when user interacts
    setAutoplay(false)
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current)
    }

    // Resume autoplay after 10 seconds of inactivity
    autoplayRef.current = setTimeout(() => {
      setAutoplay(true)
    }, 10000)
  }

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === steps.length ? 1 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, steps.length])

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      {/* Desktop view - Refined layout */}
      <div className="hidden md:block">
        {/* Step indicators with improved spacing and visual hierarchy */}
        <div className="relative mb-20 px-12">
          {/* Progress line - Refined with better positioning */}
          <div className="absolute left-[60px] right-[60px] h-1 bg-gray-800 top-1/2 transform -translate-y-1/2 z-0">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex justify-between relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  className={`process-step-number ${
                    step.id === activeStep
                      ? "process-step-active"
                      : step.id < activeStep
                        ? "process-step-completed"
                        : "process-step-inactive"
                  }`}
                  onClick={() => goToStep(step.id)}
                  aria-label={`Go to step ${step.id}: ${step.title}`}
                >
                  {step.id}
                  {step.id === activeStep && (
                    <motion.div
                      className="absolute -inset-3 rounded-full border-2 border-primary/30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </button>
                <p
                  className={`mt-4 text-sm font-medium ${step.id === activeStep ? "text-primary" : "text-gray-400"}`}
                  style={{ width: "120px", textAlign: "center" }}
                >
                  {step.title}
                </p>
                <span className="text-xs text-gray-500 mt-1">{step.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls - Refined with better spacing */}
        <div className="flex justify-center mb-10 gap-4">
          <button onClick={() => goToStep(activeStep - 1)} className="nav-button" aria-label="Previous step">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`nav-indicator ${step.id === activeStep ? "nav-indicator-active" : ""}`}
                aria-label={`Go to step ${step.id}`}
              />
            ))}
          </div>

          <button onClick={() => goToStep(activeStep + 1)} className="nav-button" aria-label="Next step">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Content area with refined layout and spacing */}
        <div className="relative min-h-[450px] mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-12 gap-10"
            >
              <div className="col-span-5">
                <motion.div className="process-step-content" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                  {/* Refined content layout with better spacing */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/30"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/5 filter blur-[50px]"></div>

                  <div className="flex items-center gap-5 mb-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      {steps[activeStep - 1].icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white">{steps[activeStep - 1].title}</h3>
                      <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mt-2">
                        {steps[activeStep - 1].duration}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 font-light leading-relaxed text-base">
                    {steps[activeStep - 1].description}
                  </p>

                  {/* Step indicator */}
                  <div className="absolute bottom-6 right-6 flex items-center gap-1 text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                    <span className="text-primary font-medium">{activeStep}</span>
                    <span>/</span>
                    <span>{steps.length}</span>
                  </div>
                </motion.div>
              </div>

              <div className="col-span-7">
                <motion.div className="process-step-image" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <div className="process-step-image-overlay"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-900/20 backdrop-blur-[1px] z-5"></div>

                  <Image
                    src={steps[activeStep - 1].image || "/placeholder.svg"}
                    alt={steps[activeStep - 1].alt}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />

                  {/* Image overlay with step number - Refined positioning */}
                  <div className="absolute top-6 right-6 z-20 bg-primary/80 text-white h-12 w-12 rounded-full flex items-center justify-center font-bold">
                    {activeStep}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile view - Refined vertical layout */}
      <div className="md:hidden space-y-6">
        {/* Mobile navigation controls - Refined spacing */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => goToStep(activeStep - 1)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`w-2 h-2 rounded-full transition-all ${
                  step.id === activeStep ? "bg-primary" : "bg-gray-700"
                }`}
                aria-label={`Go to step ${step.id}`}
              />
            ))}
          </div>

          <button
            onClick={() => goToStep(activeStep + 1)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            aria-label="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-gray-800 overflow-hidden bg-gray-900/50"
          >
            <div className="p-5 border-b border-gray-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white">
                {activeStep}
              </div>
              <div>
                <h3 className="font-medium text-primary">{steps[activeStep - 1].title}</h3>
                <span className="text-xs text-gray-400">{steps[activeStep - 1].duration}</span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-300 text-sm mb-6">{steps[activeStep - 1].description}</p>
              <div className="rounded-lg overflow-hidden border border-gray-800">
                <Image
                  src={steps[activeStep - 1].image || "/placeholder.svg"}
                  alt={steps[activeStep - 1].alt}
                  width={400}
                  height={200}
                  className="w-full h-[200px] object-cover"
                />
              </div>
            </div>

            {/* Mobile step indicator - Refined positioning */}
            <div className="p-4 border-t border-gray-800 flex justify-between items-center">
              <button
                onClick={() => goToStep(activeStep - 1)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                aria-label="Previous step"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="text-gray-400">
                <span className="text-primary font-medium">{activeStep}</span> / {steps.length}
              </div>

              <button
                onClick={() => goToStep(activeStep + 1)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                aria-label="Next step"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
