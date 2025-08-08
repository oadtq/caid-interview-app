"use client"

import Link from "next/link"
import { Mail, Globe, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="content-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company info */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="font-bold text-xl mb-4">
                <span className="gradient-text">EveryMatch</span>
                <span className="text-gray-900">.ai</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">EVERYMATCH TECHNOLOGY PTE. LTD.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">Blk 68 CIRCULAR ROAD #02-001 Singapore 049422</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <Link
                    href="mailto:Hello@everymatch.ai"
                    className="text-gray-600 text-sm hover:text-primary transition-colors"
                  >
                    Hello@everymatch.ai
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                  <Link
                    href="https://everymatch.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm hover:text-primary transition-colors"
                  >
                    https://everymatch.ai/
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-gray-900 font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Features", "AI Search Demo", "Use Cases", "How It Works", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-600 text-sm hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Connect */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-gray-900 font-medium mb-4">Connect With Us</h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover valuable connections through your extended network and unlock new opportunities.
              </p>
              <Link
                href="mailto:Hello@everymatch.ai"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                Contact Us <Mail className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs">
              &copy; {currentYear} EveryMatch Technology Pte. Ltd. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-500 text-xs hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 text-xs hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
