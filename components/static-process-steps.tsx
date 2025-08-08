"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProcessStep {
  id: number
  title: string
  duration: string
  icon: React.ReactNode
  description: string
  image: string
  alt: string
}

interface StaticProcessStepsProps {
  steps: ProcessStep[]
}

export function StaticProcessSteps({ steps }: StaticProcessStepsProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const STEP_DURATION = 2500 // Reduced from 4000ms to 2.5 seconds per step

  // Check if component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting) {
          setIsPlaying(true)
        } else {
          setIsPlaying(false)
        }
      },
      { threshold: 0.3 },
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

  // Auto-advance steps
  useEffect(() => {
    if (!isPlaying || !isVisible) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    const startTime = Date.now()

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const stepProgress = (elapsed % STEP_DURATION) / STEP_DURATION
      setProgress(stepProgress)

      if (elapsed >= STEP_DURATION) {
        setCurrentStep((prev) => (prev + 1) % steps.length)
        setProgress(0)
      }
    }, 30) // Reduced from 50ms to 30ms for smoother progress updates

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isVisible, currentStep, steps.length])

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length)
    setProgress(0)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
    setProgress(0)
  }

  const goToStep = (index: number) => {
    setCurrentStep(index)
    setProgress(0)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div ref={containerRef} className="w-full">
      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-6 mb-12">
        <Button
          variant="outline"
          size="sm"
          onClick={prevStep}
          className="rounded-full h-10 w-10 p-0 border-gray-200 hover:border-primary hover:bg-primary/5 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`h-2 rounded-full transition-all duration-200 relative overflow-hidden ${
                  index === currentStep ? "w-8 bg-gray-200" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {index === currentStep && (
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-50 ease-linear"
                    style={{ width: `${progress * 100}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={togglePlayPause}
            className="rounded-full h-8 w-8 p-0 border-gray-200 hover:border-primary hover:bg-primary/5 bg-transparent"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextStep}
          className="rounded-full h-10 w-10 p-0 border-gray-200 hover:border-primary hover:bg-primary/5 bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
        {/* Left Side - Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }} // Reduced from 0.5s to 0.3s
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg relative">
                {steps[currentStep].id}
                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress)}`}
                    className="transition-all duration-50 ease-linear"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mb-2">
                  {steps[currentStep].duration}
                </div>
                <h3 className="text-2xl font-light text-gray-900">{steps[currentStep].title}</h3>
              </div>
            </div>

            <div className="pl-20">
              <p className="text-lg text-gray-600 font-light leading-relaxed">{steps[currentStep].description}</p>
            </div>

            {/* Progress Line */}
            <div className="pl-8">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentStep + progress) / steps.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Step {currentStep + 1}</span>
                <span>{steps.length} Steps Total</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right Side - Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }} // Reduced from 0.5s to 0.3s
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-lg bg-white">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-10" />
              <Image
                src={steps[currentStep].image || "/placeholder.svg"}
                alt={steps[currentStep].alt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority={currentStep === 0}
              />
            </div>

            {/* Step Icon Overlay */}
            <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center shadow-lg z-20">
              {steps[currentStep].icon}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Indicators */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => goToStep(index)}
            className={`p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden ${
              index === currentStep
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {/* Progress overlay for current step */}
            {index === currentStep && (
              <div
                className="absolute top-0 left-0 h-full bg-primary/10 transition-all duration-50 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === currentStep ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{step.duration}</div>
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">{step.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{step.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {isPlaying ? (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Auto-playing</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-gray-400" />
              <span>Paused</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
