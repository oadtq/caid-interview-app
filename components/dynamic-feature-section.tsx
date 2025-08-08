"use client"

import type React from "react"

import { useEffect } from "react"
import Image from "next/image"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface DynamicFeatureSectionProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  reversed?: boolean
  children?: React.ReactNode
}

export function DynamicFeatureSection({
  title,
  description,
  imageSrc,
  imageAlt,
  reversed = false,
  children,
}: DynamicFeatureSectionProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const contentVariants = {
    hidden: { opacity: 0, x: reversed ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: reversed ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2,
      },
    },
  }

  return (
    <div ref={ref} className="py-16 md:py-24 relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <div
          className="absolute opacity-20"
          style={{
            top: reversed ? "20%" : "60%",
            left: reversed ? "70%" : "10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reversed ? "lg:grid-flow-dense" : ""}`}>
          <motion.div
            className={`col-span-1 ${reversed ? "lg:col-start-2" : ""}`}
            variants={contentVariants}
            initial="hidden"
            animate={controls}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6 leading-tight">{title}</h2>
            <p className="text-gray-300 mb-8">{description}</p>
            {children}
          </motion.div>

          <motion.div
            className={`col-span-1 ${reversed ? "lg:col-start-1" : ""}`}
            variants={imageVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="relative rounded-xl overflow-hidden border border-gray-800 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10" />
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={imageAlt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
