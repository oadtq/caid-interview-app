"use client"

import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export function Certificates() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificates</h1>
        <p className="text-gray-600 text-lg">View earned certificates</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-100 p-12 shadow-sm text-center">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Trophy className="h-12 w-12 text-gray-400" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You have no certifications yet. Complete one of the tracks in "Curriculum" section in order to get a
          certificate.
        </p>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Continue Learning</Button>
      </div>
    </div>
  )
}
