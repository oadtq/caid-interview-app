"use client"

import { motion } from "framer-motion"
import { CheckCircle, Award, Users, Filter } from "lucide-react"

export function SelectionProcess() {
  const selectionSteps = [
    {
      icon: <Filter className="h-6 w-6 text-primary" />,
      title: "AI-Powered Screening",
      description:
        "Our proprietary AI system screens thousands of candidates monthly, analyzing credentials, experience, and skills.",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Expert Verification",
      description:
        "Domain specialists verify technical skills and subject matter expertise through rigorous assessment protocols.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Quality Assurance",
      description:
        "Multi-layered verification with cross-checks and expert reviews ensures only the highest quality talent.",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Continuous Evaluation",
      description: "Ongoing performance monitoring and feedback loops maintain excellence across all projects.",
    },
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="content-container">
        <div className="text-center mb-12">
          <motion.h2
            className="heading-lg mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            How we select the <span className="gradient-text">top 3%</span> of subject matter experts
          </motion.h2>
          <div className="w-20 h-1 bg-primary/20 rounded-full mx-auto mt-4 mb-6"></div>
          <p className="body-lg max-w-3xl mx-auto">
            Our rigorous vetting process ensures you get access to only the most qualified talent in the region.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {selectionSteps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-md relative overflow-hidden h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Decorative elements - all blue */}
              <div className="absolute top-0 left-0 h-1 w-full bg-primary/20"></div>
              <div className="absolute top-0 left-0 h-full w-1 bg-primary/20"></div>

              {/* Step number */}
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
                {index + 1}
              </div>

              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 pr-6">{step.title}</h3>
              <p className="text-gray-600 text-sm font-light">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
