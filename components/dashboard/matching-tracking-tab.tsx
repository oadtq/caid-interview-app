"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  TrendingUp,
  History,
  Users,
  ArrowUpIcon as ArrowBounce,
  ExternalLink,
  CalendarDays,
  Hash,
  Search,
  NotebookPen,
  Plus,
  Save,
  X,
} from "lucide-react"
import { motion } from "framer-motion"

interface SessionNote {
  id: string
  date: Date
  content: string
  keyTakeaways: string[]
  nextSteps: string[]
}

interface MatchingRequest {
  id: number
  goal: string
  submittedAt: Date
  status: "pending" | "matched" | "completed" | "cancelled"
  mentor?: {
    name: string
    title: string
    company: string
    expertise: string[]
    avatar: string
    linkedinUrl: string
  }
  matchedAt?: Date
  systemRecommendation?: {
    reason: string
    suggestedTopics: string[]
    suggestedQuestions: string[]
  }
  preferredMentor?: string
  bounceReason?: string
  sessionNotes?: SessionNote[]
}

interface MatchingTrackingTabProps {
  requests: MatchingRequest[]
}

// Sample requests with LinkedIn URLs and session notes
const sampleRequests: MatchingRequest[] = [
  {
    id: 1,
    goal: "I want to transition from academia to industry AI research and need guidance on the application process and what to expect.",
    submittedAt: new Date("2024-01-15"),
    status: "matched",
    mentor: {
      name: "Sarah Chen",
      title: "Senior AI Research Scientist",
      company: "Google DeepMind",
      expertise: ["Machine Learning", "AI Research", "Career Transition"],
      avatar: "",
      linkedinUrl: "https://linkedin.com/in/sarahchen",
    },
    matchedAt: new Date("2024-01-18"),
    systemRecommendation: {
      reason:
        "Sarah has successfully transitioned from PhD research to industry AI roles and has experience at top tech companies. Her background in deep learning aligns with your research interests.",
      suggestedTopics: [
        "Industry vs Academia Research",
        "Interview Preparation",
        "Portfolio Building",
        "Networking Strategies",
      ],
      suggestedQuestions: [
        "What are the key differences between academic and industry research?",
        "How should I prepare for technical interviews at AI companies?",
        "What projects should I highlight in my portfolio?",
        "How important is networking in the AI industry?",
      ],
    },
    preferredMentor: "Someone with Google or OpenAI experience",
    sessionNotes: [
      {
        id: "note1",
        date: new Date("2024-01-25"),
        content:
          "Had a great first session with Sarah. We discussed the key differences between academic and industry research. She emphasized the importance of understanding business impact and working with cross-functional teams.",
        keyTakeaways: [
          "Industry research focuses more on practical applications",
          "Collaboration with product teams is crucial",
          "Need to learn about business metrics and KPIs",
        ],
        nextSteps: [
          "Research Google's AI products and their business impact",
          "Practice explaining research in business terms",
          "Start networking with industry professionals",
        ],
      },
      {
        id: "note2",
        date: new Date("2024-02-01"),
        content:
          "Second session focused on interview preparation. Sarah shared insights about the technical interview process at major tech companies and provided tips for presenting research work.",
        keyTakeaways: [
          "Technical interviews include both coding and research discussions",
          "Be prepared to explain research impact in simple terms",
          "Practice system design for ML applications",
        ],
        nextSteps: [
          "Practice coding problems on LeetCode",
          "Prepare 5-minute research presentation",
          "Study ML system design patterns",
        ],
      },
    ],
  },
  {
    id: 2,
    goal: "Looking for guidance on starting my own AI startup and understanding the fundraising landscape.",
    submittedAt: new Date("2024-01-10"),
    status: "completed",
    bounceReason:
      "No available mentors with AI startup experience in our current network. We're actively recruiting mentors in this space and will notify you when suitable matches become available.",
    preferredMentor: "AI startup founder or VC with AI focus",
  },
  {
    id: 3,
    goal: "Need help with career progression from junior to senior ML engineer role.",
    submittedAt: new Date("2024-01-20"),
    status: "pending",
    preferredMentor: "Senior ML engineer at FAANG company",
  },
  {
    id: 4,
    goal: "I want to break into product management and need advice on building relevant skills and experience.",
    submittedAt: new Date("2024-01-12"),
    status: "matched",
    mentor: {
      name: "Michael Rodriguez",
      title: "Senior Product Manager",
      company: "Meta",
      expertise: ["Product Management", "Strategy", "Leadership"],
      avatar: "",
      linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
    },
    matchedAt: new Date("2024-01-16"),
    systemRecommendation: {
      reason:
        "Michael has extensive experience in product management at top tech companies and can provide insights into breaking into the field and advancing your career.",
      suggestedTopics: [
        "Product Management Fundamentals",
        "Building Product Intuition",
        "Stakeholder Management",
        "Career Transition Strategies",
      ],
      suggestedQuestions: [
        "What skills are most important for a new product manager?",
        "How do you prioritize features and make product decisions?",
        "What's the best way to transition into product management?",
        "How do you work effectively with engineering and design teams?",
      ],
    },
    preferredMentor: "Product manager at a major tech company",
    sessionNotes: [
      {
        id: "note3",
        date: new Date("2024-01-22"),
        content:
          "First session with Michael was incredibly insightful. We covered the fundamentals of product management and he shared his journey from engineering to PM.",
        keyTakeaways: [
          "Product management is about solving user problems",
          "Technical background is valuable but not sufficient",
          "Need to develop business acumen and user empathy",
        ],
        nextSteps: [
          "Read 'Inspired' by Marty Cagan",
          "Start a side project to practice PM skills",
          "Interview 5 users about their pain points",
        ],
      },
    ],
  },
  {
    id: 5,
    goal: "Interested in venture capital and want to understand how to break into the industry.",
    submittedAt: new Date("2024-01-08"),
    status: "matched",
    mentor: {
      name: "Emily Wang",
      title: "Investment Director",
      company: "Andreessen Horowitz",
      expertise: ["Venture Capital", "Startup Strategy", "Financial Analysis"],
      avatar: "",
      linkedinUrl: "https://linkedin.com/in/emilywang",
    },
    matchedAt: new Date("2024-01-14"),
    systemRecommendation: {
      reason:
        "Emily has extensive experience in venture capital and can provide valuable insights into breaking into the industry and understanding investment strategies.",
      suggestedTopics: ["VC Industry Overview", "Investment Analysis", "Startup Evaluation", "Career Path in VC"],
      suggestedQuestions: [
        "What does a typical day look like for a VC?",
        "How do you evaluate startup investment opportunities?",
        "What background is most valuable for breaking into VC?",
        "How do you build relationships with entrepreneurs?",
      ],
    },
    preferredMentor: "Someone working at a top-tier VC firm",
    sessionNotes: [],
  },
  {
    id: 6,
    goal: "Looking for guidance on technical leadership and managing engineering teams.",
    submittedAt: new Date("2024-01-05"),
    status: "completed",
    bounceReason:
      "All our technical leadership mentors are currently at capacity. We expect availability to open up in 2-3 weeks and will prioritize your request.",
    preferredMentor: "Engineering manager or tech lead at a startup",
  },
  {
    id: 7,
    goal: "Want to learn about data science career paths and skill development in machine learning.",
    submittedAt: new Date("2024-01-03"),
    status: "completed",
    bounceReason:
      "Your profile indicates interest in theoretical research, but our available data science mentors focus primarily on applied/industry roles. Please update your profile if you're interested in industry applications.",
    preferredMentor: "Senior data scientist with ML expertise",
  },
]

export function MatchingTrackingTab({ requests = sampleRequests }: MatchingTrackingTabProps) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [startDateFilter, setStartDateFilter] = useState("")
  const [endDateFilter, setEndDateFilter] = useState("")
  const [requestIdFilter, setRequestIdFilter] = useState("")
  const [requestsData, setRequestsData] = useState<MatchingRequest[]>(requests)
  const [selectedRequest, setSelectedRequest] = useState<MatchingRequest | null>(null)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
  const [newNote, setNewNote] = useState({
    content: "",
    keyTakeaways: [""],
    nextSteps: [""],
  })

  const filteredRequests = requestsData.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    const requestDate = request.submittedAt.toISOString().split("T")[0] // YYYY-MM-DD
    const matchesStartDate = startDateFilter ? requestDate >= startDateFilter : true
    const matchesEndDate = endDateFilter ? requestDate <= endDateFilter : true

    const matchesRequestId = requestIdFilter ? request.id.toString().includes(requestIdFilter) : true

    return matchesStatus && matchesStartDate && matchesEndDate && matchesRequestId
  })

  const handleAddNote = () => {
    if (!selectedRequest || !newNote.content.trim()) return

    const note: SessionNote = {
      id: `note_${Date.now()}`,
      date: new Date(),
      content: newNote.content,
      keyTakeaways: newNote.keyTakeaways.filter((item) => item.trim() !== ""),
      nextSteps: newNote.nextSteps.filter((item) => item.trim() !== ""),
    }

    const updatedRequests = requestsData.map((request) => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          sessionNotes: [...(request.sessionNotes || []), note],
        }
      }
      return request
    })

    setRequestsData(updatedRequests)
    setNewNote({ content: "", keyTakeaways: [""], nextSteps: [""] })
    setShowAddNoteDialog(false)
  }

  const updateNewNoteField = (field: "keyTakeaways" | "nextSteps", index: number, value: string) => {
    setNewNote((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addNewNoteField = (field: "keyTakeaways" | "nextSteps") => {
    setNewNote((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeNoteField = (field: "keyTakeaways" | "nextSteps", index: number) => {
    setNewNote((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "matched":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "completed":
        return <ArrowBounce className="h-4 w-4 text-orange-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "matched":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    matched: requests.filter((r) => r.status === "matched").length,
    completed: requests.filter((r) => r.status === "completed").length,
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-gray-900 mb-2">Matching Tracking</h1>
        <p className="text-gray-600 font-light">Track your mentoring requests and view matching results</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Requests",
            value: stats.total,
            icon: <History className="h-5 w-5 text-primary" />,
            color: "primary",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: <Clock className="h-5 w-5 text-yellow-600" />,
            color: "yellow",
          },
          {
            label: "Matched",
            value: stats.matched,
            icon: <Users className="h-5 w-5 text-green-600" />,
            color: "green",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: <ArrowBounce className="h-5 w-5 text-orange-600" />,
            color: "orange",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-2xl font-light text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-2 items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 h-10 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="matched">Matched</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="pl-9 pr-4 h-10 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 focus:outline-none"
                aria-label="Start Date"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="pl-9 pr-4 h-10 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 focus:outline-none"
                aria-label="End Date"
              />
            </div>

            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Request ID"
                value={requestIdFilter}
                onChange={(e) => setRequestIdFilter(e.target.value)}
                className="pl-9 pr-4 h-10 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 focus:outline-none"
                aria-label="Request ID"
              />
            </div>
          </div>
          <Button variant="outline" className="h-10 px-4 rounded-lg bg-transparent">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </motion.div>

      {/* Requests List */}
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="current" className="rounded-md">
            Current Requests
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-md">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {filteredRequests
            .filter((r) => r.status === "pending" || r.status === "matched")
            .map((request, index) => (
              <motion.div
                key={request.id}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Request #{request.id}</h3>
                      <p className="text-sm text-gray-500">Submitted {request.submittedAt.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Badge className={`${getStatusColor(request.status)} border`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Goal</h4>
                    <p className="text-gray-600 text-sm">{request.goal}</p>
                  </div>

                  {request.preferredMentor && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Mentor</h4>
                      <p className="text-gray-600 text-sm">{request.preferredMentor}</p>
                    </div>
                  )}

                  {request.mentor && (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Matched Mentor</h4>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{request.mentor.name}</h5>
                          <p className="text-sm text-gray-600">
                            {request.mentor.title} at {request.mentor.company}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a href={request.mentor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-lg">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View LinkedIn Profile
                            </Button>
                          </a>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {request.mentor.expertise.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Session Notes Section */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <NotebookPen className="h-4 w-4" />
                            Session Notes ({request.sessionNotes?.length || 0})
                          </h4>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request)
                                setShowNotesDialog(true)
                              }}
                              className="text-xs"
                            >
                              View All Notes
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request)
                                setShowAddNoteDialog(true)
                              }}
                              className="bg-primary hover:bg-primary/90 text-white text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Note
                            </Button>
                          </div>
                        </div>

                        {request.sessionNotes && request.sessionNotes.length > 0 ? (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">
                              Latest session:{" "}
                              {request.sessionNotes[request.sessionNotes.length - 1].date.toLocaleDateString()}
                            </div>
                            <p className="text-sm text-gray-800 line-clamp-2">
                              {request.sessionNotes[request.sessionNotes.length - 1].content}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-sm text-gray-500">No session notes yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {request.systemRecommendation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">System's Recommendation</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-blue-800 mb-1">Why this match:</h5>
                          <p className="text-sm text-blue-700">{request.systemRecommendation.reason}</p>
                        </div>

                        {request.systemRecommendation.suggestedTopics.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-blue-800 mb-2">Suggested discussion topics:</h5>
                            <div className="flex flex-wrap gap-1">
                              {request.systemRecommendation.suggestedTopics.map((topic, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.systemRecommendation.suggestedQuestions.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-blue-800 mb-2">Suggested questions to ask:</h5>
                            <ul className="text-sm text-blue-700 space-y-1">
                              {request.systemRecommendation.suggestedQuestions.map((question, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{question}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {filteredRequests
            .filter((r) => r.status === "completed" || r.status === "cancelled")
            .map((request, index) => (
              <motion.div
                key={request.id}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm opacity-75"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.75, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <History className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">Request #{request.id}</h3>
                      <p className="text-sm text-gray-500">
                        {request.status === "completed" ? "Completed" : "Cancelled"} on{" "}
                        {request.matchedAt?.toLocaleDateString() || request.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Badge className={`${getStatusColor(request.status)} border`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Goal</h4>
                    <p className="text-gray-600 text-sm">{request.goal}</p>
                  </div>

                  {request.mentor && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Mentor</h4>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{request.mentor.name}</p>
                          <p className="text-sm text-gray-500">{request.mentor.title}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {request.status === "completed" && request.bounceReason && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowBounce className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Bounce Reason</span>
                      </div>
                      <p className="text-sm text-orange-700">{request.bounceReason}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </TabsContent>
      </Tabs>

      {/* View All Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <NotebookPen className="h-5 w-5" />
              Session Notes - {selectedRequest?.mentor?.name}
            </DialogTitle>
            <DialogDescription>All your session notes with this mentor</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {selectedRequest?.sessionNotes && selectedRequest.sessionNotes.length > 0 ? (
              selectedRequest.sessionNotes.map((note, index) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Session {index + 1}</h4>
                    <span className="text-sm text-gray-500">{note.date.toLocaleDateString()}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Session Notes</h5>
                      <p className="text-sm text-gray-600">{note.content}</p>
                    </div>

                    {note.keyTakeaways.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Key Takeaways</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {note.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {note.nextSteps.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Next Steps</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {note.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">→</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <NotebookPen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No session notes yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Session Note - {selectedRequest?.mentor?.name}
            </DialogTitle>
            <DialogDescription>Record your session notes, key takeaways, and next steps</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="session-content" className="text-sm font-medium text-gray-700">
                Session Notes *
              </Label>
              <Textarea
                id="session-content"
                placeholder="Describe what you discussed in this session..."
                value={newNote.content}
                onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                className="min-h-[120px] mt-2"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Key Takeaways</Label>
              <div className="space-y-2">
                {newNote.keyTakeaways.map((takeaway, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a key takeaway..."
                      value={takeaway}
                      onChange={(e) => updateNewNoteField("keyTakeaways", index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 focus:outline-none text-sm"
                    />
                    {newNote.keyTakeaways.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeNoteField("keyTakeaways", index)}
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addNewNoteField("keyTakeaways")}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Takeaway
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Next Steps</Label>
              <div className="space-y-2">
                {newNote.nextSteps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a next step..."
                      value={step}
                      onChange={(e) => updateNewNoteField("nextSteps", index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 focus:outline-none text-sm"
                    />
                    {newNote.nextSteps.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeNoteField("nextSteps", index)}
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addNewNoteField("nextSteps")}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddNote}
                disabled={!newNote.content.trim()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddNoteDialog(false)
                  setNewNote({ content: "", keyTakeaways: [""], nextSteps: [""] })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
