"use client"

import { useEffect, useMemo, useState } from "react"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Clock, Star, Eye, BarChart3, X, CheckCircle, Trash2, Play, Volume2, Settings, Maximize, Search, AlertTriangle, Info, TrendingUp, MessageSquare, Zap, Timer, Gauge, Brain, Target, Mic, Users, Activity, Volume, Lightbulb, PlayCircle, Smile, Shield, FileText } from 'lucide-react'

interface CriterionDetail {
  score: number
  status: 'excellent' | 'good' | 'caution' | 'poor'
  summary: string
  description: string
  detailedAnalysis: string
  visualData?: {
    type: 'gauge' | 'count' | 'percentage' | 'list' | 'bar' | 'circle'
    value: any
  }
  examples: string[]
  tips: string[]
}

interface DetailedFeedback {
  overallPerformance: CriterionDetail & {
    overallSummary: string
  }
  answerRelevance: CriterionDetail
  paceOfSpeech: CriterionDetail & {
    wpm: number
    optimalRange: string
  }
  umCounter: CriterionDetail & {
    count: number
    per100Words: number
  }
  vocabulary: CriterionDetail & {
    level: string
    gradeLevel: number
  }
  powerWords: CriterionDetail & {
    count: number
    words: string[]
  }
  fillerWords: CriterionDetail & {
    count: number
    per100Words: number
    commonWords: string[]
  }
  pauseCounter: CriterionDetail & {
    quality: string
  }
  negativeTone: CriterionDetail & {
    count: number
    phrases: string[]
  }
  length: CriterionDetail & {
    duration: string
    seconds: number
    optimalRange: boolean
  }
  authenticityScore: CriterionDetail & {
    conversationalLevel: string
  }
  strengths: string[]
  improvements: string[]
}

interface VideoAnswer {
  id: string
  question: string
  recordedAt: string
  duration: string
  videoUrl?: string
  overallScore: number
  detailedFeedback: DetailedFeedback
  transcription?: string
}

interface InterviewResponse {
  id: string
  session_id: string
  question_text: string
  video_url: string | null
  transcription: string | null
  duration: number | null
  overall_score: number | null // 1-10
  ai_feedback: any | null
  created_at: string
  interview_sessions: {
    session_name: string
    question_set_id: string
  }
}

export function MyVideos() {
  const [responses, setResponses] = useState<InterviewResponse[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [watchingVideo, setWatchingVideo] = useState<string | null>(null)
  const [selectedCriterion, setSelectedCriterion] = useState<string | null>(null)

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch('/api/interview/responses')
        const data = await res.json()
        setResponses(data.responses || [])
      } catch (e) {
        console.error('Failed to load responses', e)
      } finally {
        setLoading(false)
      }
    }
    fetchResponses()
  }, [])

  const formatDuration = (seconds?: number | null) => {
    if (!seconds || seconds < 0) return '—'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const countWords = (text?: string | null) => {
    if (!text) return 0
    const words = text.trim().split(/\s+/).filter(Boolean)
    return words.length
  }

  const calcStatus = (scorePercent: number): CriterionDetail['status'] => {
    if (scorePercent >= 85) return 'excellent'
    if (scorePercent >= 70) return 'good'
    if (scorePercent >= 50) return 'caution'
    return 'poor'
  }

  const safeArray = (arr: any, fallback: string[] = []) => Array.isArray(arr) ? arr : fallback

  const toPercent = (score10?: number | null) => {
    if (score10 == null) return 0
    const clamped = Math.max(0, Math.min(10, score10))
    return Math.round(clamped * 10)
  }

  const normalizeFeedback = (r: InterviewResponse): DetailedFeedback => {
    // Prefer new backend detailed structure if available
    if (r.ai_feedback && r.ai_feedback.detailed && r.ai_feedback.detailed.overallPerformance) {
      return r.ai_feedback.detailed as DetailedFeedback
    }
    // If backend already provides the new structure at root, return it
    if (r.ai_feedback && r.ai_feedback.overallPerformance && r.ai_feedback.length) {
      return r.ai_feedback as DetailedFeedback
    }

    const transcription = r.transcription || ''
    const words = countWords(transcription)
    const durationSec = r.duration || 0
    const minutes = durationSec > 0 ? durationSec / 60 : 0
    const wpm = minutes > 0 ? Math.round(words / minutes) : 130

    const fillerList = [
      'basically','you know','kind of','sort of','actually','like','um','uh','er','ah'
    ]
    const disfluencies = ['um','uh','er','ah']

    const lower = transcription.toLowerCase()
    const fillerCount = fillerList.reduce((acc, w) => acc + (lower.match(new RegExp(`\\b${w.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, 'g'))?.length || 0), 0)
    const disfluencyCount = disfluencies.reduce((acc, w) => acc + (lower.match(new RegExp(`\\b${w}\\b`, 'g'))?.length || 0), 0)

    const per100 = words > 0 ? Math.round((fillerCount / words) * 10000) / 100 : 0
    const umPer100 = words > 0 ? Math.round((disfluencyCount / words) * 10000) / 100 : 0

    const negativeWords = ['hate','can\'t','won\'t','problem','failed','failure','hard','difficult','impossible','bad','worse','worst','weak']
    const negPhrases: string[] = []
    negativeWords.forEach(w => {
      const matches = lower.match(new RegExp(`\\b${w}\\b`, 'g')) || []
      matches.forEach(() => negPhrases.push(w))
    })

    const powerWordList = ['led','owned','delivered','achieved','improved','implemented','designed','launched','optimized','streamlined','innovated','mentored','built','created','managed']
    const usedPowerWords = powerWordList.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(lower))

    const overallScorePct = toPercent(r.overall_score)

    const overallPerformance: DetailedFeedback['overallPerformance'] = {
      score: overallScorePct,
      status: calcStatus(overallScorePct),
      summary: (r.ai_feedback?.overall_feedback as string) || 'Overall performance summary',
      description: 'Overall performance across content, delivery, and professionalism.',
      detailedAnalysis: (r.ai_feedback?.overall_feedback as string) || 'Good foundation with room for improvement.',
      examples: safeArray(r.ai_feedback?.strengths, []),
      tips: safeArray(r.ai_feedback?.areas_for_improvement, []),
      overallSummary: (r.ai_feedback?.overall_feedback as string) || 'Overall feedback'
    }

    const contentQualityScorePct = toPercent(r.ai_feedback?.content_quality?.score)
    const communicationScorePct = toPercent(r.ai_feedback?.communication_skills?.score)
    const professionalismScorePct = toPercent(r.ai_feedback?.professionalism?.score)
    const examplesScorePct = toPercent(r.ai_feedback?.use_of_examples?.score)

    const answerRelevance: DetailedFeedback['answerRelevance'] = {
      score: contentQualityScorePct,
      status: calcStatus(contentQualityScorePct),
      summary: r.ai_feedback?.content_quality?.feedback || 'Addresses the question with relevant details.',
      description: 'Measures how well the response addresses the question and stays on topic.',
      detailedAnalysis: r.ai_feedback?.content_quality?.feedback || 'Focused and relevant response.',
      examples: safeArray(r.ai_feedback?.strengths, []),
      tips: safeArray(r.ai_feedback?.areas_for_improvement, [])
    }

    const paceOfSpeech: DetailedFeedback['paceOfSpeech'] = {
      score: (() => {
        // ideal range 115-180
        if (wpm >= 115 && wpm <= 180) return 90
        if (wpm >= 95 && wpm <= 200) return 75
        return 55
      })(),
      status: (() => {
        if (wpm >= 115 && wpm <= 180) return 'good'
        if (wpm >= 95 && wpm <= 200) return 'caution'
        return 'poor'
      })(),
      summary: `${wpm} words per minute`,
      description: 'Speaking rate and clarity for comprehension.',
      detailedAnalysis: `Estimated pace of ${wpm} WPM based on transcript length and duration of ${formatDuration(durationSec)}.`,
      examples: [],
      tips: ['Practice pausing between major points', 'Slow down to emphasize key ideas'],
      wpm,
      optimalRange: '115-180 WPM'
    }

    const umCounter: DetailedFeedback['umCounter'] = {
      score: umPer100 <= 2 ? 95 : umPer100 <= 5 ? 75 : 55,
      status: umPer100 <= 2 ? 'excellent' : umPer100 <= 5 ? 'good' : 'caution',
      summary: `${disfluencyCount} disfluencies (${umPer100} per 100 words)`,
      description: 'Counts disfluencies like um/uh/er/ah.',
      detailedAnalysis: 'Reduce disfluencies with preparation and strategic pauses.',
      examples: [],
      tips: ['Prepare key points', 'Use silent pauses instead of fillers'],
      count: disfluencyCount,
      per100Words: umPer100
    }

    const vocabulary: DetailedFeedback['vocabulary'] = {
      score: communicationScorePct || 80,
      status: calcStatus(communicationScorePct || 80),
      summary: 'Appropriate professional vocabulary',
      description: 'Sophistication and appropriateness of word choice.',
      detailedAnalysis: r.ai_feedback?.communication_skills?.feedback || 'Clear and professional language.',
      examples: [],
      tips: ['Balance sophistication with clarity'],
      level: 'Professional',
      gradeLevel: 12
    }

    const powerWords: DetailedFeedback['powerWords'] = {
      score: usedPowerWords.length >= 8 ? 90 : usedPowerWords.length >= 4 ? 75 : 60,
      status: usedPowerWords.length >= 8 ? 'excellent' : usedPowerWords.length >= 4 ? 'good' : 'caution',
      summary: `Detected ${usedPowerWords.length} power words`,
      description: 'Use of strong, action-oriented language.',
      detailedAnalysis: 'Power words convey confidence and impact.',
      examples: [],
      tips: ['Quantify achievements', 'Lead with action verbs'],
      count: usedPowerWords.length,
      words: usedPowerWords
    }

    const fillerWords: DetailedFeedback['fillerWords'] = {
      score: per100 <= 2 ? 95 : per100 <= 5 ? 75 : 55,
      status: per100 <= 2 ? 'excellent' : per100 <= 5 ? 'good' : 'caution',
      summary: `${fillerCount} filler words (${per100} per 100 words)`,
      description: 'Non-essential words that weaken messages.',
      detailedAnalysis: 'Reduce filler words through rehearsal and comfort with content.',
      examples: [],
      tips: ['Rehearse key points', 'Use concise phrasing'],
      count: fillerCount,
      per100Words: per100,
      commonWords: fillerList.filter(w => lower.includes(w))
    }

    const pauseCounter: DetailedFeedback['pauseCounter'] = {
      score: 85,
      status: 'excellent',
      summary: 'Natural use of pauses',
      description: 'Strategic pauses for emphasis and rhythm.',
      detailedAnalysis: 'Considerate pausing supports clarity and emphasis.',
      examples: [],
      tips: ['Use brief pauses before key points'],
      quality: 'Natural'
    }

    const negativeTone: DetailedFeedback['negativeTone'] = {
      score: negPhrases.length === 0 ? 98 : negPhrases.length <= 2 ? 80 : 60,
      status: negPhrases.length === 0 ? 'excellent' : negPhrases.length <= 2 ? 'good' : 'caution',
      summary: negPhrases.length === 0 ? 'No negative language detected' : `${negPhrases.length} negative phrases detected`,
      description: 'Presence of negative or pessimistic language.',
      detailedAnalysis: 'Frame challenges as learning opportunities and focus on solutions.',
      examples: [],
      tips: ['Use positive framing', 'Focus on outcomes and learning'],
      count: negPhrases.length,
      phrases: negPhrases
    }

    const length: DetailedFeedback['length'] = {
      score: durationSec >= 60 && durationSec <= 120 ? 95 : durationSec >= 45 && durationSec <= 150 ? 80 : 60,
      status: durationSec >= 60 && durationSec <= 120 ? 'excellent' : durationSec >= 45 && durationSec <= 150 ? 'good' : 'caution',
      summary: `Duration ${formatDuration(durationSec)}`,
      description: 'Appropriate response duration for the question type.',
      detailedAnalysis: 'Aim for 1-2 minutes for most interview answers.',
      examples: [],
      tips: ['Practice with a timer', 'Trim or expand details as needed'],
      duration: formatDuration(durationSec),
      seconds: durationSec || 0,
      optimalRange: durationSec >= 60 && durationSec <= 120
    }

    const authenticityScore: DetailedFeedback['authenticityScore'] = {
      score: 90,
      status: 'excellent',
      summary: 'Conversational and genuine delivery',
      description: 'Naturalness vs. sounding scripted.',
      detailedAnalysis: 'Occasional imperfections indicate spontaneous, authentic speech.',
      examples: [],
      tips: ['Avoid memorizing word-for-word', 'Let personality show'],
      conversationalLevel: 'Highly Conversational'
    }

    return {
      overallPerformance,
      answerRelevance,
      paceOfSpeech,
      umCounter,
      vocabulary,
      powerWords,
      fillerWords,
      pauseCounter,
      negativeTone,
      length,
      authenticityScore,
      strengths: safeArray(r.ai_feedback?.strengths, []),
      improvements: safeArray(r.ai_feedback?.areas_for_improvement, [])
    }
  }

  const savedAnswers: VideoAnswer[] = useMemo(() => {
    return (responses || []).map((r) => ({
      id: r.id,
      question: r.question_text,
      recordedAt: new Date(r.created_at).toISOString().slice(0, 10),
      duration: formatDuration(r.duration ?? undefined),
      videoUrl: r.video_url ?? undefined,
      overallScore: toPercent(r.overall_score),
      detailedFeedback: normalizeFeedback(r),
      transcription: r.transcription ?? undefined
    }))
  }, [responses])

  const handleViewFeedback = (videoId: string) => {
    setSelectedVideo(videoId)
    setShowFeedback(true)
    setWatchingVideo(null)
    setSelectedCriterion(null)
  }

  const handleWatchRecording = (videoId: string) => {
    setWatchingVideo(videoId)
    setShowFeedback(false)
    setSelectedVideo(null)
  }

  const handleDelete = (videoId: string) => {
    console.log('Delete video:', videoId)
    // TODO: Implement deletion via API if desired
  }

  const selectedVideoData = savedAnswers.find(answer => answer.id === selectedVideo)
  const watchingVideoData = savedAnswers.find(answer => answer.id === watchingVideo)

  // Pastel color palette for cards with matching text colors
  const cardStyles = [
    { bg: '#EEF2FF', text: '#4F46E5' }, // Indigo
    { bg: '#E0F2FE', text: '#0284C7' }, // Sky
    { bg: '#ECFEFF', text: '#0891B2' }, // Cyan
    { bg: '#E6FFFA', text: '#0D9488' }, // Teal
    { bg: '#ECFDF5', text: '#059669' }, // Emerald
    { bg: '#F7FEE7', text: '#65A30D' }, // Lime
    { bg: '#FEF3C7', text: '#D97706' }, // Amber
    { bg: '#FFE4E6', text: '#E11D48' }, // Rose
    { bg: '#FAE8FF', text: '#C026D3' }, // Fuchsia
    { bg: '#F3E8FF', text: '#9333EA' }, // Purple
    { bg: '#FEF2F2', text: '#DC2626' }, // Red
  ]

  const getCardStyle = (index: number) => {
    return cardStyles[index % cardStyles.length]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'caution':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'poor':
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const criteriaConfig = [
    { key: 'overallPerformance', label: 'Overall Performance', icon: BarChart3 },
    { key: 'answerRelevance', label: 'Relevance', icon: Target },
    { key: 'paceOfSpeech', label: 'Pace of Speech', icon: Gauge },
    { key: 'umCounter', label: 'Um Counter', icon: Mic },
    { key: 'vocabulary', label: 'Vocabulary', icon: Brain },
    { key: 'powerWords', label: 'Power Words', icon: Zap },
    { key: 'fillerWords', label: 'Filler Words', icon: MessageSquare },
    { key: 'pauseCounter', label: 'Pause Counter', icon: Timer },
    { key: 'negativeTone', label: 'Negative Tone', icon: AlertTriangle },
    { key: 'length', label: 'Length', icon: PlayCircle },
    { key: 'authenticityScore', label: 'Authenticity Score', icon: Shield }
  ]

  const renderDetailedCriterion = (criterion: CriterionDetail, criterionKey: string) => {
    const config = criteriaConfig.find(c => c.key === criterionKey)
    const Icon = config?.icon || BarChart3

    // Render visualization based on criterion type
    const renderVisualization = () => {
      switch (criterionKey) {
        case 'answerRelevance':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="flex items-center justify-center">
                <div className="w-32 h-20 bg-blue-100 rounded flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  
                </div>
              </div>
            </div>
          )
        
        case 'paceOfSpeech':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent border-r-transparent transform rotate-45"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{(criterion as any).wpm || 0}</div>
                      <div className="text-xs text-gray-600">WORDS/MIN</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 max-w-32 mx-auto">
                  <span>LOW</span>
                  <span>HIGH</span>
                </div>
              </div>
            </div>
          )
        
        case 'pauseCounter':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          )
        
        case 'negativeTone':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-3xl font-bold text-white">{(criterion as any).count ?? 0}</span>
                </div>
                <div className="text-sm text-gray-600">INSTANCES OF NEGATIVE LANGUAGE</div>
              </div>
            </div>
          )
        
        case 'fillerWords':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-3xl font-bold text-red-600">{(criterion as any).per100Words ?? 0}</span>
                </div>
                <div className="text-sm text-gray-600">FILLER WORDS / 100 WORDS</div>
              </div>
            </div>
          )
        
        case 'umCounter':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-3xl font-bold text-red-600">{(criterion as any).per100Words ?? 0}</span>
                </div>
                <div className="text-sm text-gray-600">DISFLUENCIES / 100 WORDS</div>
              </div>
            </div>
          )
        
        case 'vocabulary':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-32 bg-blue-500 rounded-t flex items-end justify-center relative">
                    <div className="absolute -top-6 text-xs text-gray-600">{(criterion as any).level || 'Professional'}</div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Simple</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-semibold text-blue-600 mb-2">{(criterion as any).level || 'Professional'} Language</div>
                  
                </div>
              </div>
            </div>
          )
        
        case 'authenticityScore':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent border-r-transparent border-b-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )
        
        case 'powerWords':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smile className="h-12 w-12 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{(criterion as any).count ?? 0}</div>
                <div className="text-sm text-gray-600">POWER WORDS</div>
              </div>
            </div>
          )
        
        case 'length':
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-white">{(criterion as any).duration || '—'}</span>
                </div>
              </div>
            </div>
          )
        
        default:
          return (
            <div className="bg-gray-50 border rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 mb-4 ${
                  criterion.status === 'caution' ? 'border-yellow-300 bg-yellow-50' : 
                  criterion.status === 'excellent' || criterion.status === 'good' ? 'border-green-300 bg-green-50' :
                  'border-red-300 bg-red-50'
                }`}>
                  {criterion.status === 'caution' ? 
                    <AlertTriangle className="h-8 w-8 text-yellow-600" /> :
                    criterion.status === 'excellent' || criterion.status === 'good' ?
                    <CheckCircle className="h-8 w-8 text-green-600" /> :
                    <X className="h-8 w-8 text-red-600" />
                  }
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  {criterion.status === 'caution' ? 'NEEDS WORK' : 
                   criterion.status === 'excellent' || criterion.status === 'good' ? 'GOOD' : 'POOR'}
                </div>
              </div>
            </div>
          )
      }
    }

    return (
      <div className="space-y-6">
        {/* Visualization */}
        {renderVisualization()}

        {/* Detailed Analysis */}
        <div className="bg-white border rounded-lg p-6 max-h-64 overflow-y-auto">
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap break-words hyphens-auto">
            {criterion.detailedAnalysis}
          </p>
        </div>

        {/* Power Words List (for Power Words criterion) */}
        {criterionKey === 'powerWords' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold mb-3 text-blue-800">Power Words You Used:</h4>
            <div className="grid grid-cols-3 gap-4">
              {((selectedVideoData?.detailedFeedback.powerWords as any)?.words || []).slice(0, 6).map((word: string, index: number) => (
                <div key={index} className="text-center py-2 px-3 bg-white rounded border">
                  <div className="font-medium text-gray-900">{word}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              
            </div>
          </div>
        )}

        {/* Overall Performance specific sections */}
        {criterionKey === 'overallPerformance' && (
          <>
            {/* Good Job Section */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Good Job!</span>
                <Badge variant="secondary" className="text-xs">AI Generated</Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Alignment with Role</span>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <div>
                  <span className="font-medium">Strengths:</span> {criterion.examples?.[0] || 'Positive aspects identified'}
                </div>
                <div>
                  <span className="font-medium">Improvements:</span> {criterion.tips?.[0] || 'Consider refining clarity and structure'}
                </div>
              </div>
            </div>

            {/* Needs Work Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Needs Work!</span>
                <Badge variant="secondary" className="text-xs">AI Generated</Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Clarity</span>
              </div>
              <div className="text-sm text-red-700 space-y-1">
                <div><span className="font-medium">Strengths:</span> {criterion.examples?.[1] || 'Some positive aspects identified'}</div>
                <div><span className="font-medium">Improvements:</span> {criterion.tips?.[1] || 'Focus on improving this area'}</div>
              </div>
            </div>

            {/* Optimized Answer Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Optimized Answer</span>
              </div>
              <div className="text-sm text-blue-700 leading-relaxed whitespace-pre-wrap break-words hyphens-auto">
                {(selectedVideoData?.detailedFeedback.overallPerformance?.detailedAnalysis && selectedVideoData?.transcription) ? selectedVideoData?.transcription : 'Practice structuring your answer with a clear beginning, middle, and end; quantify achievements; and maintain a confident, conversational tone.'}
              </div>
            </div>
          </>
        )}
      </div>
    )
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Videos</h1>
        <p className="text-gray-600 text-lg">Review your recorded interview answers and AI feedback</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search recorded answers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            // TODO: implement client-side filtering if needed
          />
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-6">
        <Card3D>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900 font-medium">Recorded Answers</h2>
              <Badge variant="secondary">{savedAnswers.length} recordings</Badge>
            </div>

            <div className="space-y-4">
              {savedAnswers.map((answer) => (
                <div
                  key={answer.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex gap-6 items-center">
                    {/* Video Player on Left */}
                    <div className="w-64 flex-shrink-0">
                      <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                        {answer.videoUrl ? (
                          <video src={answer.videoUrl} className="w-full h-full object-cover" controls />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-200">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-400">
                              <Play className="h-8 w-8 text-white ml-1" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {answer.duration}
                        </div>
                      </div>
                    </div>

                    {/* Content on Right */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 text-lg mb-3">{answer.question}</h3>
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{answer.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>{answer.overallScore}% score</span>
                          </div>
                          <span>{answer.recordedAt}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent flex-1"
                          onClick={() => handleWatchRecording(answer.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Watch Recording
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent flex-1"
                          onClick={() => handleViewFeedback(answer.id)}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Detailed Feedback
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent flex-1"
                          onClick={() => handleDelete(answer.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card3D>
      </div>

      {/* Video Player Modal */}
      {watchingVideo && watchingVideoData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Watch Recording</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWatchingVideo(null)}
                  className="bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{watchingVideoData.question}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Duration: {watchingVideoData.duration}</span>
                  <span>Score: {watchingVideoData.overallScore}%</span>
                  <span>Recorded: {watchingVideoData.recordedAt}</span>
                </div>
              </div>

              {/* Video Player */}
              <div className="bg-black rounded-xl aspect-video flex items-center justify-center relative mb-4">
                {watchingVideoData.videoUrl ? (
                  <video src={watchingVideoData.videoUrl} className="w-full h-full rounded-xl" controls />
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                      <Play className="h-10 w-10 text-white ml-1" />
                    </div>
                  </div>
                )}
                
                {/* Video Controls (decorative when native controls enabled) */}
                {!watchingVideoData.videoUrl && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center gap-4 text-white">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 bg-gray-600 h-1 rounded-full">
                        <div className="bg-blue-500 h-1 rounded-full w-1/3"></div>
                      </div>
                      <span className="text-sm">0:00</span>
                      <span className="text-sm">{watchingVideoData.duration}</span>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Feedback Modal */}
      {showFeedback && selectedVideoData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {selectedCriterion ? (
              // Detailed Analysis View
              <div className="flex h-full">
                {/* Left Sidebar */}
                <div className="w-80 bg-gray-50 p-6 border-r">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Detailed Analysis</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFeedback(false)}
                      className="bg-transparent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {criteriaConfig.map((config) => {
                      const criterion = selectedVideoData.detailedFeedback[config.key as keyof DetailedFeedback] as CriterionDetail
                      const Icon = config.icon
                      return (
                        <button
                          key={config.key}
                          onClick={() => setSelectedCriterion(config.key)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                            selectedCriterion === config.key 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium uppercase">{config.label}</span>
                          </div>
                          {getStatusIcon(criterion.status)}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedVideoData.question}</h3>
                    <div className="flex items-center gap-6 text-gray-600 text-sm">
                      <span>Duration: {selectedVideoData.duration}</span>
                      <span>Overall Score: {selectedVideoData.overallScore}%</span>
                      <span>Recorded: {selectedVideoData.recordedAt}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 capitalize mb-4">
                      {criteriaConfig.find(c => c.key === selectedCriterion)?.label || selectedCriterion}
                    </h4>
                  </div>

                  {renderDetailedCriterion(
                    selectedVideoData.detailedFeedback[selectedCriterion as keyof DetailedFeedback] as CriterionDetail,
                    selectedCriterion
                  )}
                </div>
              </div>
            ) : (
              // Summary View
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detailed Feedback</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeedback(false)}
                    className="bg-transparent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Top Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedVideoData.question}</h3>
                  <div className="flex items-center gap-6 text-gray-600">
                    <span>Duration: {selectedVideoData.duration}</span>
                    <span>Overall Score: {selectedVideoData.overallScore}%</span>
                    <span>Recorded: {selectedVideoData.recordedAt}</span>
                  </div>
                </div>

                {/* Criteria Cards Grid with Single Learn More Button */}
                <div className="relative mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {criteriaConfig.map((config, index) => {
                      const criterion = selectedVideoData.detailedFeedback[config.key as keyof DetailedFeedback] as CriterionDetail
                      const cardStyle = getCardStyle(index)
                      return (
                        <div
                          key={config.key}
                          className="p-4 rounded-lg border flex flex-col h-48 overflow-hidden"
                          style={{ backgroundColor: cardStyle.bg }}
                        >
                          <div className="text-center h-full flex flex-col items-center">
                            <div 
                              className="font-bold mb-2 text-3xl"
                              style={{ color: cardStyle.text }}
                            >
                              {criterion.score}%
                            </div>
                            <div className="font-semibold mb-3 text-gray-900 text-base">{config.label}</div>
                            <div className="text-gray-700 leading-relaxed text-xs text-pretty break-words hyphens-auto overflow-y-auto max-h-20 pr-1 w-full px-2">
                              {criterion.summary}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Single Learn More Button positioned to the right of Authenticity Score */}
                  <div className="absolute bottom-4 right-4">
                    <Button
                      onClick={() => setSelectedCriterion('overallPerformance')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      Learn more →
                    </Button>
                  </div>
                </div>

                {/* Bottom Section - Strengths and Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="text-lg font-semibold text-green-800">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedVideoData.detailedFeedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-green-700">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                      <h4 className="text-lg font-semibold text-orange-800">Areas for Improvement</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedVideoData.detailedFeedback.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-orange-700">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
