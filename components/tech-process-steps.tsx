"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

interface ProcessStep {
  id: number
  title: string
  duration: string
  icon: React.ReactNode
  description: string
  image: string
  alt: string
}

interface TechProcessStepsProps {
  steps: ProcessStep[]
}

export function TechProcessSteps({ steps }: TechProcessStepsProps) {
  const [activeStep, setActiveStep] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  // Auto-advance steps every 5 seconds, but only if the component is visible
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === steps.length ? 1 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [steps.length, isVisible])

  return (
    <div ref={containerRef} className="w-full">
      {/* Desktop view - Horizontal process */}
      <div className="hidden md:block">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8 relative">
          {/* Progress line */}
          <div className="absolute left-0 right-0 h-1 bg-gray-200 top-1/2 transform -translate-y-1/2 z-0">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step) => (
            <div key={step.id} className="z-10 flex flex-col items-center">
              <button
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all relative ${
                  step.id === activeStep
                    ? "bg-primary text-white shadow-lg"
                    : step.id < activeStep
                      ? "bg-primary/80 text-white"
                      : "bg-white text-gray-400 border border-gray-200"
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                {step.id}
                {step.id === activeStep && (
                  <div
                    className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping"
                    style={{ animationDuration: "2s" }}
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

        {/* Content area */}
        <div className="relative h-[400px] mt-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`absolute inset-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-500 ease-in-out ${
                step.id === activeStep ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              style={{
                transform: step.id === activeStep ? "translateX(0)" : "translateX(50px)",
              }}
            >
              <div className="grid grid-cols-2 h-full">
                <div className="p-8 flex flex-col tech-accent">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{step.title}</h3>
                      <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mt-1">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 font-light flex-grow">{step.description}</p>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex gap-1">
                      {steps.map((s) => (
                        <button
                          key={s.id}
                          className={`w-2 h-2 rounded-full transition-all ${
                            s.id === activeStep ? "bg-primary w-6" : "bg-gray-300"
                          }`}
                          onClick={() => setActiveStep(s.id)}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        onClick={() => setActiveStep((prev) => (prev === 1 ? steps.length : prev - 1))}
                        disabled={activeStep === 1}
                      >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      </button>
                      <button
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        onClick={() => setActiveStep((prev) => (prev === steps.length ? 1 : prev + 1))}
                        disabled={activeStep === steps.length}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative border-l border-gray-100 bg-gray-50/50 grid-overlay">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-white to-transparent z-10" />
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.alt}
                    width={600}
                    height={400}
                    className="w-full h-full object-contain p-6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile view - Vertical process */}
      <div className="md:hidden space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`rounded-xl border transition-all duration-300 ${
              step.id === activeStep ? "border-primary shadow-md" : "border-gray-200"
            } overflow-hidden bg-white`}
            onClick={() => setActiveStep(step.id)}
          >
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${
                  step.id === activeStep ? "bg-primary" : "bg-gray-400"
                }`}
              >
                {step.id}
              </div>
              <div>
                <h3 className={`font-medium ${step.id === activeStep ? "text-primary" : "text-gray-700"}`}>
                  {step.title}
                </h3>
                <span className="text-xs text-gray-500">{step.duration}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">{step.description}</p>
              <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                <Image
                  src={step.image || "/placeholder.svg"}
                  alt={step.alt}
                  width={400}
                  height={200}
                  className="w-full h-[160px] object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
