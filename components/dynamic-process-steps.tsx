"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface ProcessStep {
  id: number
  title: string
  duration: string
  icon: React.ReactNode
  description: string
  image: string
  alt: string
}

interface DynamicProcessStepsProps {
  steps: ProcessStep[]
}

export function DynamicProcessSteps({ steps }: DynamicProcessStepsProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === steps.length ? 1 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="w-full">
      {/* Desktop view - Dynamic layout */}
      <div className="hidden md:block">
        <div className="relative mb-16">
          {/* Progress line */}
          <div className="absolute left-0 right-0 h-0.5 bg-gray-800 top-1/2 transform -translate-y-1/2 z-0">
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
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all relative ${
                    step.id === activeStep
                      ? "bg-primary text-white shadow-lg"
                      : step.id < activeStep
                        ? "bg-primary/80 text-white"
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  {step.id}
                  {step.id === activeStep && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border-2 border-primary/30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </button>
                <p className={`mt-2 text-sm font-medium ${step.id === activeStep ? "text-primary" : "text-gray-500"}`}>
                  {step.title}
                </p>
                <span className="text-xs text-gray-500 mt-1">{step.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content area with dynamic layout */}
        <div className="relative min-h-[400px] mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-12 gap-8"
            >
              <div className="col-span-5">
                <div className="p-8 bg-gray-900/50 rounded-xl border border-gray-800 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      {steps[activeStep - 1].icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white">{steps[activeStep - 1].title}</h3>
                      <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mt-1">
                        {steps[activeStep - 1].duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 font-light">{steps[activeStep - 1].description}</p>
                </div>
              </div>

              <div className="col-span-7">
                <div className="relative rounded-xl overflow-hidden border border-gray-800 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10" />
                  <Image
                    src={steps[activeStep - 1].image || "/placeholder.svg"}
                    alt={steps[activeStep - 1].alt}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile view - Vertical layout */}
      <div className="md:hidden space-y-6">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            className={`rounded-xl transition-all duration-300 ${
              step.id === activeStep ? "border-primary shadow-md" : "border-gray-800"
            } overflow-hidden bg-gray-900/50 border`}
            onClick={() => setActiveStep(step.id)}
            whileHover={{ y: -5 }}
          >
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${
                  step.id === activeStep ? "bg-primary" : "bg-gray-700"
                }`}
              >
                {step.id}
              </div>
              <div>
                <h3 className={`font-medium ${step.id === activeStep ? "text-primary" : "text-gray-300"}`}>
                  {step.title}
                </h3>
                <span className="text-xs text-gray-500">{step.duration}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-300 text-sm mb-4">{step.description}</p>
              <div className="rounded-lg overflow-hidden border border-gray-800">
                <Image
                  src={step.image || "/placeholder.svg"}
                  alt={step.alt}
                  width={400}
                  height={200}
                  className="w-full h-[160px] object-cover"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
