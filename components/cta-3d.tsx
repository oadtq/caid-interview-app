"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface CTA3DProps {
  title: string
  description: string
  buttonText: string
  benefits: string[]
}

export function CTA3D({ title, description, buttonText, benefits }: CTA3DProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl perspective-container">
      {/* Background with 3D effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"
        initial={{ rotateX: 0, rotateY: 0 }}
        whileHover={{ rotateX: 2, rotateY: 2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 opacity-30 enhanced-dots-pattern"></div>

        {/* Static decorative elements - all blue */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-primary/20 opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-primary/20 opacity-20"></div>

        {/* Additional static decorative elements - all blue */}
        <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-primary/20 opacity-15"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 rounded-full bg-primary/20 opacity-15"></div>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-light mb-4 text-gray-900">{title}</h3>
          <p className="text-gray-600 mb-6 font-light">{description}</p>
          <Button className="button-3d bg-primary text-white hover:bg-primary/90 rounded-lg px-6 h-12 shadow-md flex items-center gap-2 group w-fit">
            {buttonText}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Decorative elements - all blue */}
                <div className="absolute top-0 left-0 h-full w-1 bg-primary/20 rounded-l-lg"></div>

                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 border border-primary/20 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <p className="text-gray-700 font-light">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
