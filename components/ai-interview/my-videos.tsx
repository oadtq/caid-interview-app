"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Calendar, Clock, Star, TrendingUp, BarChart3, Eye, Download, Trash2 } from 'lucide-react'

interface InterviewResponse {
  id: string
  session_id: string
  question_text: string
  video_url: string
  transcription: string
  duration: number
  overall_score: number
  ai_feedback: {
    content_quality: { score: number; feedback: string }
    communication_skills: { score: number; feedback: string }
    professionalism: { score: number; feedback: string }
    use_of_examples: { score: number; feedback: string }
    strengths: string[]
    areas_for_improvement: string[]
    overall_feedback: string
  }
  created_at: string
  interview_sessions: {
    session_name: string
    question_set_id: string
  }
}

export function MyVideos() {
  const [responses, setResponses] = useState<InterviewResponse[]>([])
  const [selectedResponse, setSelectedResponse] = useState<InterviewResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/interview/responses')
      const data = await response.json()
      setResponses(data.responses || [])
    } catch (error) {
      console.error('Error fetching responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50'
    if (score >= 6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800'
    if (score >= 6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const calculateAverageScore = () => {
    if (responses.length === 0) return 0
    const total = responses.reduce((sum, response) => sum + (response.overall_score || 0), 0)
    return Math.round(total / responses.length)
  }

  const getImprovementTrend = () => {
    if (responses.length < 2) return 0
    const recent = responses.slice(0, 3).reduce((sum, r) => sum + (r.overall_score || 0), 0) / Math.min(3, responses.length)
    const older = responses.slice(-3).reduce((sum, r) => sum + (r.overall_score || 0), 0) / Math.min(3, responses.length)
    return Math.round(recent - older)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Videos</h1>
        <p className="text-gray-600 text-lg">Review your interview practice sessions and AI feedback</p>
      </div>

      {responses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
            <p className="text-gray-600 mb-6">Start practicing to see your recorded interview sessions here</p>
            <Button>Start Practice Session</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold">{responses.length}</p>
                  </div>
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold">{calculateAverageScore()}/10</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Improvement</p>
                    <p className={`text-2xl font-bold ${getImprovementTrend() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {getImprovementTrend() >= 0 ? '+' : ''}{getImprovementTrend()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Time</p>
                    <p className="text-2xl font-bold">
                      {Math.round(responses.reduce((sum, r) => sum + (r.duration || 0), 0) / 60)}m
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="videos" className="space-y-6">
            <TabsList>
              <TabsTrigger value="videos">All Videos</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-6">
              <div className="grid gap-6">
                {responses.map((response) => (
                  <Card key={response.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {response.interview_sessions.session_name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mb-2">
                            {response.question_text}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(response.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(response.duration)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getScoreBadgeColor(response.overall_score)}>
                            {response.overall_score}/10
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Video Player */}
                        <div className="space-y-3">
                          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                            <video
                              src={response.video_url}
                              controls
                              className="w-full h-full object-cover"
                              poster="/placeholder.svg?height=200&width=300&text=Video+Thumbnail"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedResponse(response)}
                              className="flex-1"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Quick Feedback */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">AI Feedback Summary</h4>
                          
                          {response.ai_feedback && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className={`p-3 rounded-lg ${getScoreColor(response.ai_feedback.content_quality.score)}`}>
                                  <div className="text-sm font-medium">Content Quality</div>
                                  <div className="text-lg font-bold">{response.ai_feedback.content_quality.score}/10</div>
                                </div>
                                <div className={`p-3 rounded-lg ${getScoreColor(response.ai_feedback.communication_skills.score)}`}>
                                  <div className="text-sm font-medium">Communication</div>
                                  <div className="text-lg font-bold">{response.ai_feedback.communication_skills.score}/10</div>
                                </div>
                                <div className={`p-3 rounded-lg ${getScoreColor(response.ai_feedback.professionalism.score)}`}>
                                  <div className="text-sm font-medium">Professionalism</div>
                                  <div className="text-lg font-bold">{response.ai_feedback.professionalism.score}/10</div>
                                </div>
                                <div className={`p-3 rounded-lg ${getScoreColor(response.ai_feedback.use_of_examples.score)}`}>
                                  <div className="text-sm font-medium">Examples</div>
                                  <div className="text-lg font-bold">{response.ai_feedback.use_of_examples.score}/10</div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <h5 className="text-sm font-medium text-green-700 mb-1">Strengths</h5>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {response.ai_feedback.strengths.map((strength, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                        {strength}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-orange-700 mb-1">Areas for Improvement</h5>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {response.ai_feedback.areas_for_improvement.map((area, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                                        {area}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-8 text-gray-500">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Performance chart would be displayed here</p>
                        <p className="text-sm">Track your improvement over time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skill Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {responses.length > 0 && responses[0].ai_feedback && (
                        <>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Content Quality</span>
                              <span className="text-sm text-gray-600">
                                {Math.round(responses.reduce((sum, r) => sum + (r.ai_feedback?.content_quality.score || 0), 0) / responses.length)}/10
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(responses.reduce((sum, r) => sum + (r.ai_feedback?.content_quality.score || 0), 0) / responses.length) * 10}%` 
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Communication Skills</span>
                              <span className="text-sm text-gray-600">
                                {Math.round(responses.reduce((sum, r) => sum + (r.ai_feedback?.communication_skills.score || 0), 0) / responses.length)}/10
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(responses.reduce((sum, r) => sum + (r.ai_feedback?.communication_skills.score || 0), 0) / responses.length) * 10}%` 
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Professionalism</span>
                              <span className="text-sm text-gray-600">
                                {Math.round(responses.reduce((sum, r) => sum + (r.ai_feedback?.professionalism.score || 0), 0) / responses.length)}/10
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(responses.reduce((sum, r) => sum + (r.ai_feedback?.professionalism.score || 0), 0) / responses.length) * 10}%` 
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Use of Examples</span>
                              <span className="text-sm text-gray-600">
                                {Math.round(responses.reduce((sum, r) => sum + (r.ai_feedback?.use_of_examples.score || 0), 0) / responses.length)}/10
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(responses.reduce((sum, r) => sum + (r.ai_feedback?.use_of_examples.score || 0), 0) / responses.length) * 10}%` 
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Detailed Feedback Modal */}
          {selectedResponse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedResponse.interview_sessions.session_name}</CardTitle>
                      <p className="text-gray-600 mt-1">{selectedResponse.question_text}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedResponse(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedResponse.transcription && (
                    <div>
                      <h4 className="font-semibold mb-2">Transcription</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{selectedResponse.transcription}</p>
                      </div>
                    </div>
                  )}

                  {selectedResponse.ai_feedback && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Detailed AI Feedback</h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Content Quality ({selectedResponse.ai_feedback.content_quality.score}/10)</h5>
                            <p className="text-sm text-gray-600">{selectedResponse.ai_feedback.content_quality.feedback}</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Communication Skills ({selectedResponse.ai_feedback.communication_skills.score}/10)</h5>
                            <p className="text-sm text-gray-600">{selectedResponse.ai_feedback.communication_skills.feedback}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Professionalism ({selectedResponse.ai_feedback.professionalism.score}/10)</h5>
                            <p className="text-sm text-gray-600">{selectedResponse.ai_feedback.professionalism.feedback}</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Use of Examples ({selectedResponse.ai_feedback.use_of_examples.score}/10)</h5>
                            <p className="text-sm text-gray-600">{selectedResponse.ai_feedback.use_of_examples.feedback}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium mb-2">Overall Feedback</h5>
                        <p className="text-gray-700">{selectedResponse.ai_feedback.overall_feedback}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
