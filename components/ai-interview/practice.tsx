"use client"

import { useEffect, useRef, useState } from "react"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, MessageSquare, Clock, Star, Camera, ArrowLeft, ArrowRight, Mic, Volume2, Globe, Building2, Target, GraduationCap, Check, X, Square, RotateCcw, CameraOff, MicOff, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from "next/navigation"

interface PracticeProps {
  onTabChange?: (tab: string) => void
}

interface QuestionSetData {
  [key: string]: {
    [key: string]: string[] | {
      [key: string]: string[] | {
        [key: string]: string[]
      }
    }
  }
}

export function Practice({ onTabChange }: PracticeProps) {
  const searchParams = useSearchParams()
  const [questionData, setQuestionData] = useState<QuestionSetData>({})
  const [loading, setLoading] = useState(true)
  
  // Navigation states
  const [currentStep, setCurrentStep] = useState<'category' | 'subcategory' | 'subsubcategory' | 'subsubsubcategory' | 'interview'>('category')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('')
  const [selectedSubSubSubCategory, setSelectedSubSubSubCategory] = useState('')
  
  // Interview states
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [sessionQuestions, setSessionQuestions] = useState<string[]>([])
  const [currentSession, setCurrentSession] = useState<any>(null)

  // Recording states
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [hasStartedRecording, setHasStartedRecording] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [timeLimit] = useState(60) // 1 minute time limit
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle')

  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const videoChunksRef = useRef<Blob[]>([])
  const audioChunksRef = useRef<Blob[]>([])

  // Load question data
  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        const response = await fetch('/api/interview/question-sets-data')
        if (response.ok) {
          const data = await response.json()
          setQuestionData(data)
        }
      } catch (error) {
        console.error('Failed to load question data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadQuestionData()
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const category = searchParams.get('category')
    const subCategory = searchParams.get('subCategory')
    const subSubCategory = searchParams.get('subSubCategory')
    const subSubSubCategory = searchParams.get('subSubSubCategory')

    if (category) {
      setSelectedCategory(category)
      if (subCategory) {
        setSelectedSubCategory(subCategory)
        if (subSubCategory) {
          setSelectedSubSubCategory(subSubCategory)
          if (subSubSubCategory) {
            setSelectedSubSubSubCategory(subSubSubCategory)
            setCurrentStep('interview')
          } else {
            setCurrentStep('subsubsubcategory')
          }
        } else {
          setCurrentStep('subsubcategory')
        }
      } else {
        setCurrentStep('subcategory')
      }
    }
  }, [searchParams])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !stream) return
    try {
      // Attach stream and ensure playback starts
      if (v.srcObject !== stream) {
        v.srcObject = stream
      }
      // Some browsers require an explicit play() call
      const playPromise = v.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          v.muted = true
          v.play().catch(() => {})
        })
      }
    } catch (err) {
      console.error('Failed to start video preview:', err)
    }
  }, [stream])

  const initializeCamera = async () => {
    try {
      // Always request both video and audio; we can toggle tracks after
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(mediaStream)
      if (videoRef.current) {
        const v = videoRef.current
        v.srcObject = mediaStream
        v.muted = true
        // Attempt to start playback immediately
        v.play().catch(() => {
          // Ignore autoplay restrictions; the separate effect will retry
        })
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes('general') || categoryLower.includes('common')) return Globe
    if (categoryLower.includes('industry') || categoryLower.includes('business')) return Building2
    if (categoryLower.includes('competency') || categoryLower.includes('skill')) return Target
    if (categoryLower.includes('admission') || categoryLower.includes('education')) return GraduationCap
    if (categoryLower.includes('technical') || categoryLower.includes('tech')) return Video
    if (categoryLower.includes('behavioral') || categoryLower.includes('behavior')) return MessageSquare
    return Globe
  }

  const getCategories = () => {
    return Object.keys(questionData)
  }

  const getSubCategories = (category: string) => {
    const categoryData = questionData[category]
    if (!categoryData) return []
    return Object.keys(categoryData)
  }

  const getSubSubCategories = (category: string, subCategory: string) => {
    const categoryData = questionData[category]
    if (!categoryData || !categoryData[subCategory]) return []
    
    const subCategoryData = categoryData[subCategory]
    if (Array.isArray(subCategoryData)) return []
    
    return Object.keys(subCategoryData)
  }

  const getSubSubSubCategories = (category: string, subCategory: string, subSubCategory: string) => {
    const categoryData = questionData[category]
    if (!categoryData || !categoryData[subCategory]) return []
    
    const subCategoryData = categoryData[subCategory]
    if (Array.isArray(subCategoryData) || !subCategoryData[subSubCategory]) return []
    
    const subSubCategoryData = subCategoryData[subSubCategory]
    if (Array.isArray(subSubCategoryData)) return []
    
    return Object.keys(subSubCategoryData)
  }

  const getQuestions = (category: string, subCategory?: string, subSubCategory?: string, subSubSubCategory?: string): string[] => {
    const categoryData = questionData[category]
    if (!categoryData) return []
    
    if (!subCategory) {
      // Get all questions from category
      const allQuestions: string[] = []
      Object.values(categoryData).forEach(subCat => {
        if (Array.isArray(subCat)) {
          allQuestions.push(...subCat)
        } else {
          Object.values(subCat).forEach(subSubCat => {
            if (Array.isArray(subSubCat)) {
              allQuestions.push(...subSubCat)
            } else {
              Object.values(subSubCat).forEach(questions => {
                if (Array.isArray(questions)) {
                  allQuestions.push(...questions)
                }
              })
            }
          })
        }
      })
      return allQuestions
    }
    
    const subCategoryData = categoryData[subCategory]
    if (!subCategoryData) return []
    
    if (Array.isArray(subCategoryData)) {
      return subCategoryData
    }
    
    if (!subSubCategory) {
      // Get all questions from subcategory
      const allQuestions: string[] = []
      Object.values(subCategoryData).forEach(subSubCat => {
        if (Array.isArray(subSubCat)) {
          allQuestions.push(...subSubCat)
        } else {
          Object.values(subSubCat).forEach(questions => {
            if (Array.isArray(questions)) {
              allQuestions.push(...questions)
            }
          })
        }
      })
      return allQuestions
    }
    
    const subSubCategoryData = subCategoryData[subSubCategory]
    if (!subSubCategoryData) return []
    
    if (Array.isArray(subSubCategoryData)) {
      return subSubCategoryData
    }
    
    if (!subSubSubCategory) {
      // Get all questions from subsubcategory
      const allQuestions: string[] = []
      Object.values(subSubCategoryData).forEach(questions => {
        if (Array.isArray(questions)) {
          allQuestions.push(...questions)
        }
      })
      return allQuestions
    }
    
    const questions = subSubCategoryData[subSubSubCategory]
    return Array.isArray(questions) ? questions : []
  }

  const selectRandomQuestions = (questions: string[], count: number = 5): string[] => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, questions.length))
  }

  const toggleCamera = () => {
    if (!stream) return
    const vt = stream.getVideoTracks()[0]
    if (vt) {
      if (cameraEnabled) {
        // Turning camera off
        vt.enabled = false
        setCameraEnabled(false)
      } else {
        // Turning camera on
        vt.enabled = true
        setCameraEnabled(true)
        // Ensure video element is still connected to stream
        if (videoRef.current && videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      }
    }
  }

  const toggleMic = () => {
    if (!stream) return
    const at = stream.getAudioTracks()[0]
    if (at) {
      at.enabled = !micEnabled
      setMicEnabled(!micEnabled)
    }
  }

  const startRecording = () => {
    if (!stream) return

    // Reset chunk refs
    videoChunksRef.current = []
    audioChunksRef.current = []

    // Create cloned tracks for recording to avoid interfering with preview
    const videoTrack = stream.getVideoTracks()[0]
    const audioTrack = stream.getAudioTracks()[0]
    
    if (!videoTrack || !audioTrack) return

    // Clone tracks for recording
    const clonedVideoTrack = videoTrack.clone()
    const clonedAudioTrack = audioTrack.clone()
    
    const recordingStream = new MediaStream([clonedVideoTrack, clonedAudioTrack])

    const preferredTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      ''
    ]
    const mimeType = preferredTypes.find(t => !t || MediaRecorder.isTypeSupported(t)) || 'video/webm'
    const options = mimeType ? { mimeType } as MediaRecorderOptions : undefined
    const recorder = new MediaRecorder(recordingStream, options)
    
    recorder.ondataavailable = (ev) => {
      console.log('Video ondataavailable, data size:', ev.data.size)
      if (ev.data.size > 0) {
        videoChunksRef.current.push(ev.data)
        console.log('Video chunks now:', videoChunksRef.current.length)
      }
    }
    recorder.onstop = () => {
      console.log('Video recorder onstop, chunks length:', videoChunksRef.current.length)
      setRecordedChunks([...videoChunksRef.current])
      // Clean up cloned tracks
      clonedVideoTrack.stop()
      clonedAudioTrack.stop()
    }
    recorder.start(1000) // Request data every 1 second
    setMediaRecorder(recorder)

    // Start parallel audio-only recorder
    const audioStream = new MediaStream([clonedAudioTrack.clone()])
    const audioMime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', ''].find(t => !t || MediaRecorder.isTypeSupported(t)) || 'audio/webm'
    const audioOptions = audioMime ? { mimeType: audioMime } as MediaRecorderOptions : undefined
    const aRecorder = new MediaRecorder(audioStream, audioOptions)
    
    aRecorder.ondataavailable = (ev) => {
      if (ev.data.size > 0) {
        audioChunksRef.current.push(ev.data)
      }
    }
    aRecorder.onstop = () => {
      setAudioChunks([...audioChunksRef.current])
      // Clean up audio stream
      audioStream.getTracks().forEach(track => track.stop())
    }
    aRecorder.start(1000) // Request data every 1 second
    setAudioRecorder(aRecorder)

    setIsRecording(true)
    setRecordingTime(0)
    setTimeRemaining(timeLimit)
    
    // Timer for recording time and countdown
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1
        const remaining = timeLimit - newTime
        
        // Update time remaining
        setTimeRemaining(remaining)
        
        // Auto-stop when time limit is reached
        if (remaining <= 0) {
          stopRecording()
        }
        
        return newTime
      })
    }, 1000)
  }

  const stopRecording = () => {
    console.log('stopRecording called, isRecording:', isRecording, 'mediaRecorder:', mediaRecorder)
    console.log('Current video chunks in ref:', videoChunksRef.current.length)
    
    if (mediaRecorder && isRecording) {
      // Request any remaining data before stopping
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.requestData()
      }
      mediaRecorder.stop()
      console.log('mediaRecorder.stop() called')
    }
    if (audioRecorder && isRecording) {
      // Request any remaining data before stopping
      if (audioRecorder.state === 'recording') {
        audioRecorder.requestData()
      }
      audioRecorder.stop()
      console.log('audioRecorder.stop() called')
    }
    
    // Immediately set the chunks from refs so Submit button appears right away
    if (videoChunksRef.current.length > 0) {
      setRecordedChunks([...videoChunksRef.current])
      console.log('Immediately set recordedChunks to:', videoChunksRef.current.length)
    }
    if (audioChunksRef.current.length > 0) {
      setAudioChunks([...audioChunksRef.current])
    }
    
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const uploadRecording = async () => {
    if (!currentSession || recordedChunks.length === 0) return
    setIsUploading(true)
    setUploadStatus('uploading')
    try {
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' })
      const currentQuestion = sessionQuestions[currentQuestionIndex]

      const formData = new FormData()
      formData.append('video', videoBlob)
      formData.append('sessionId', currentSession.id)
      formData.append('questionId', `q${currentQuestionIndex}`)
      formData.append('questionText', currentQuestion)
      formData.append('duration', recordingTime.toString())

      const uploadRes = await fetch('/api/interview/upload-video', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const uploadData = await uploadRes.json()

      setUploadStatus('analyzing')
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' })
      const audioForm = new FormData()
      audioForm.append('audio', audioFile)
      audioForm.append('responseId', uploadData.response.id)
      audioForm.append('questionText', currentQuestion)
      const analyzeRes = await fetch('/api/interview/analyze-audio', { method: 'POST', body: audioForm })
      if (!analyzeRes.ok) throw new Error('Analysis failed')

      setUploadStatus('complete')

      setTimeout(() => {
        if (currentQuestionIndex < sessionQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          resetRecording()
        } else {
          if (onTabChange) onTabChange('videos')
          else window.location.href = '/ai-interview?tab=videos'
        }
      }, 1200)
    } catch (e) {
      console.error('Upload error:', e)
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  const resetRecording = () => {
    setRecordedChunks([])
    setAudioChunks([])
    videoChunksRef.current = []
    audioChunksRef.current = []
    setRecordingTime(0)
    setTimeRemaining(timeLimit)
    setUploadStatus('idle')
    setHasStartedRecording(false)
    setCountdown(0)
    setIsRecording(false)
  }

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const startSession = async (questions: string[]) => {
    try {
      const sessionName = `Practice - ${selectedCategory} (${new Date().toLocaleString()})`
      
      // Try to create a session using the sessions API
      // We'll use a placeholder questionSetId and handle it on the backend
      const sessionData = {
        sessionName,
        questionSetId: 'practice-session', // Placeholder ID
        questions: questions.map((q, i) => ({ id: `q${i}`, text: q, timeLimit: 120 }))
      }

      const res = await fetch('/api/interview/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      })

      if (res.ok) {
        // If session creation succeeds, use the real session
        const data = await res.json()
        setCurrentSession(data.session)
        setSessionQuestions(questions)
        setCurrentQuestionIndex(0)
        setCurrentStep('interview')
        setIsInterviewStarted(true)
        await initializeCamera()
      } else {
        // Fallback to mock session if API fails
        console.log('Session API failed, using mock session')
        const session = {
          id: generateUUID(), // Use proper UUID format
          session_name: sessionName,
          questions: questions.map((q, i) => ({ id: `q${i}`, text: q }))
        }
        setCurrentSession(session)
        setSessionQuestions(questions)
        setCurrentQuestionIndex(0)
        setCurrentStep('interview')
        setIsInterviewStarted(true)
        await initializeCamera()
      }
    } catch (e) {
      console.error('Start session error:', e)
      // Fallback to mock session
      const session = {
        id: generateUUID(),
        session_name: `Practice - ${selectedCategory} (${new Date().toLocaleString()})`,
        questions: questions.map((q, i) => ({ id: `q${i}`, text: q }))
      }
      setCurrentSession(session)
      setSessionQuestions(questions)
      setCurrentQuestionIndex(0)
      setCurrentStep('interview')
      setIsInterviewStarted(true)
      await initializeCamera()
    }
  }

  const handleStartRecording = () => {
    setCountdown(3)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setHasStartedRecording(true)
          startRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleBackToSetup = () => {
    setIsInterviewStarted(false)
    setSelectedCategory('')
    setSelectedSubCategory('')
    setSelectedSubSubCategory('')
    setSelectedSubSubSubCategory('')
    setCurrentStep('category')
    setIsRecording(false)
    setCountdown(0)
    setHasStartedRecording(false)
    setCurrentQuestionIndex(0)
    setUploadStatus('idle')
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setCurrentStep('subcategory')
  }

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory)
    const subSubCategories = getSubSubCategories(selectedCategory, subCategory)
    if (subSubCategories.length > 0) {
      setCurrentStep('subsubcategory')
    } else {
      // No further subcategories, start interview
      const questions = getQuestions(selectedCategory, subCategory)
      const selectedQuestions = selectRandomQuestions(questions)
      startSession(selectedQuestions)
    }
  }

  const handleSubSubCategorySelect = (subSubCategory: string) => {
    setSelectedSubSubCategory(subSubCategory)
    const subSubSubCategories = getSubSubSubCategories(selectedCategory, selectedSubCategory, subSubCategory)
    if (subSubSubCategories.length > 0) {
      setCurrentStep('subsubsubcategory')
    } else {
      // No further subcategories, start interview
      const questions = getQuestions(selectedCategory, selectedSubCategory, subSubCategory)
      const selectedQuestions = selectRandomQuestions(questions)
      startSession(selectedQuestions)
    }
  }

  const handleSubSubSubCategorySelect = (subSubSubCategory: string) => {
    setSelectedSubSubSubCategory(subSubSubCategory)
    const questions = getQuestions(selectedCategory, selectedSubCategory, selectedSubSubCategory, subSubSubCategory)
    const selectedQuestions = selectRandomQuestions(questions)
    startSession(selectedQuestions)
  }

  const handleBack = () => {
    switch (currentStep) {
      case 'subcategory':
        setCurrentStep('category')
        setSelectedCategory('')
        break
      case 'subsubcategory':
        setCurrentStep('subcategory')
        setSelectedSubCategory('')
        break
      case 'subsubsubcategory':
        setCurrentStep('subsubcategory')
        setSelectedSubSubCategory('')
        break
      case 'interview':
        handleBackToSetup()
        break
    }
  }

  const RecordingInterface = () => {
    const q = sessionQuestions[currentQuestionIndex]
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-8">
        {/* Question Title */}
        <div className="text-center mb-6 max-w-4xl">
          <h1 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 leading-relaxed">
            {q}
          </h1>
          <div className="mb-4">
            <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {sessionQuestions.length}</span>
          </div>
          <div className="mb-4">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Clock className="h-3 w-3 mr-1" />
              1 minute time limit
            </Badge>
          </div>
          <div className="flex justify-center gap-2 mb-8">
            {sessionQuestions.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentQuestionIndex ? 'bg-blue-600' : idx < currentQuestionIndex ? 'bg-blue-300' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>

        {/* Centered Video Section */}
        <div className="flex justify-center w-full max-w-6xl mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Left Side - Audio Question */}
            <div className="w-full">
              <div className="aspect-video bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center p-6 h-full">
                <div className="text-center flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Volume2 className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-4 font-normal">Listen to Question</h3>
                  <Button
                    onClick={async () => {
                      if (!q) return
                      try {
                        const audioRes = await fetch(`/api/interview/analyze-audio?tts=1&text=${encodeURIComponent(q)}`)
                        if (!audioRes.ok) return
                        const blob = await audioRes.blob()
                        const url = URL.createObjectURL(blob)
                        const audio = new Audio(url)
                        audio.play()
                      } catch (e) {
                        console.error('TTS playback failed:', e)
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    Play Audio
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Webcam Feed */}
            <div className="w-full">
              <div className="aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white relative shadow-lg h-full overflow-hidden">
                {countdown > 0 ? (
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-4">{countdown}</div>
                    <p className="text-lg">Get ready...</p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Microphone Indicator */}
                    {isRecording && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black bg-opacity-50 rounded-lg px-3 py-2">
                        <Mic className="h-4 w-4 text-green-400" />
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-green-400 rounded-full"></div>
                          <div className="w-1 h-4 bg-green-400 rounded-full"></div>
                          <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    )}

                    {/* Time Remaining Countdown */}
                    {isRecording && timeRemaining <= 10 && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white rounded-lg px-3 py-2 font-bold text-lg">
                        {timeRemaining}s
                      </div>
                    )}

                    {/* Recording Time Display */}
                    {isRecording && timeRemaining > 10 && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-lg px-3 py-2 font-medium">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </div>
                    )}

                    {/* Upload overlay states */}
                    {uploadStatus !== 'idle' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 text-center space-y-3 text-gray-900">
                          {uploadStatus === 'uploading' && <p className="font-medium">Uploading video...</p>}
                          {uploadStatus === 'analyzing' && <p className="font-medium">Analyzing your response...</p>}
                          {uploadStatus === 'complete' && <p className="font-medium">Analysis complete!</p>}
                          {uploadStatus === 'error' && <p className="font-medium text-red-600">Upload failed. Please try again.</p>}
                        </div>
                      </div>
                    )}

                    {/* Control Bar */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleCamera}
                        className={`bg-white/90 text-slate-800 border-white/80 shadow ${!cameraEnabled ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                      >
                        {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMic}
                        className={`bg-white/90 text-slate-800 border-white/80 shadow ${!micEnabled ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                      >
                        {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>

                      {!hasStartedRecording && (
                        <Button onClick={handleStartRecording} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium">
                          <Video className="h-4 w-4 mr-2" />
                          Start Interview
                        </Button>
                      )}

                      {isRecording && (
                        <Button onClick={stopRecording} variant="destructive" className="px-4 py-2">
                          <Square className="h-4 w-4 mr-1" /> Stop
                        </Button>
                      )}

                      {!isRecording && recordedChunks.length > 0 && uploadStatus === 'idle' && (
                        <>
                          <Button onClick={resetRecording} variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button onClick={uploadRecording} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                            <Upload className="h-4 w-4 mr-2" /> Submit
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between w-full max-w-6xl">
          <Button
            variant="outline"
            onClick={handleBackToSetup}
            className="px-8 py-2 text-gray-600 border-gray-300 hover:bg-gray-50 bg-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                // navigate to previous question
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                  resetRecording()
                }
              }}
              variant="outline"
              disabled={uploadStatus === 'uploading' || uploadStatus === 'analyzing' || isUploading || currentQuestionIndex === 0}
              className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Question
            </Button>
            <Button 
              onClick={() => {
                if (!isRecording && recordedChunks.length > 0 && uploadStatus === 'idle') {
                  uploadRecording()
                } else {
                  // If nothing to upload, move next
                  if (currentQuestionIndex < sessionQuestions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                    resetRecording()
                  } else {
                    if (onTabChange) onTabChange('videos')
                    else window.location.href = '/ai-interview?tab=videos'
                  }
                }
              }}
              disabled={uploadStatus === 'uploading' || uploadStatus === 'analyzing' || isUploading}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 
               uploadStatus === 'analyzing' ? 'Analyzing...' : 
               currentQuestionIndex === (sessionQuestions.length - 1) ? 'Finish' : 'Next Question'}
              {uploadStatus === 'idle' && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading practice questions...</div>
      </div>
    )
  }

  // Recording Interface Component
  if (currentStep === 'interview' && isInterviewStarted) {
    return <RecordingInterface />
  }

  // Category selection view
  if (currentStep === 'category') {
    return (
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice</h1>
          <p className="text-gray-600 text-lg">Live mock interview exercises with AI feedback</p>
        </div>

        {/* Mock Interview Setup */}
        <Card3D>
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Mock Interview</h2>
              <p className="text-gray-600">Select a category and start your practice session</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Category Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCategories().map((category) => {
                    const IconComponent = getCategoryIcon(category)
                    return (
                      <div
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 p-3 bg-blue-50 rounded-full">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 mb-2 font-medium">{category}</h4>
                            <p className="text-sm text-gray-600">
                              {Object.keys(questionData[category] || {}).length} subcategories available
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Interview Info */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">5 Questions</div>
                  <div className="text-sm text-gray-600">Per session</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">15-20 mins</div>
                  <div className="text-sm text-gray-600">Estimated duration</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">AI Feedback</div>
                  <div className="text-sm text-gray-600">Instant analysis</div>
                </div>
              </div>

              {/* Note about selection */}
              <div className="text-center text-gray-500 text-sm">
                Select a category above to continue
              </div>
            </div>
          </div>
        </Card3D>
      </div>
    )
  }

  // Subcategory selection view
  if (currentStep === 'subcategory') {
    return (
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice</h1>
          <p className="text-gray-600 text-lg">Live mock interview exercises with AI feedback</p>
        </div>

        {/* Sub-category Selection */}
        <Card3D>
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCategory}</h2>
              <p className="text-gray-600">Choose a subcategory to continue</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Sub-categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Sub-Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getSubCategories(selectedCategory).map((subCategory) => (
                    <div
                      key={subCategory}
                      onClick={() => handleSubCategorySelect(subCategory)}
                      className="px-4 py-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <span className="text-sm text-gray-700 font-medium">{subCategory}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Info */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">5 Questions</div>
                  <div className="text-sm text-gray-600">Per session</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">15-20 mins</div>
                  <div className="text-sm text-gray-600">Estimated duration</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">AI Feedback</div>
                  <div className="text-sm text-gray-600">Instant analysis</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-8 py-3 text-gray-600 border-gray-300 hover:bg-gray-50 bg-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="text-center text-gray-500 text-sm flex items-center">
                  Select a subcategory above to continue
                </div>
              </div>
            </div>
          </div>
        </Card3D>
      </div>
    )
  }

  // Sub-subcategory selection view
  if (currentStep === 'subsubcategory') {
    return (
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to {selectedCategory}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice</h1>
          <p className="text-gray-600 text-lg">Live mock interview exercises with AI feedback</p>
        </div>

        {/* Sub-category Selection */}
        <Card3D>
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSubCategory}</h2>
              <p className="text-gray-600">Choose a specific area</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Sub-categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Area</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getSubSubCategories(selectedCategory, selectedSubCategory).map((subSubCategory) => (
                    <div
                      key={subSubCategory}
                      onClick={() => handleSubSubCategorySelect(subSubCategory)}
                      className="px-4 py-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <span className="text-sm text-gray-700 font-medium">{subSubCategory}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Info */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">5 Questions</div>
                  <div className="text-sm text-gray-600">Per session</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">15-20 mins</div>
                  <div className="text-sm text-gray-600">Estimated duration</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">AI Feedback</div>
                  <div className="text-sm text-gray-600">Instant analysis</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-8 py-3 text-gray-600 border-gray-300 hover:bg-gray-50 bg-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="text-center text-gray-500 text-sm flex items-center">
                  Select an area above to continue
                </div>
              </div>
            </div>
          </div>
        </Card3D>
      </div>
    )
  }

  // Sub-sub-subcategory selection view
  if (currentStep === 'subsubsubcategory') {
    return (
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ChevronLeft className="w-4 w-4 mr-2" />
            Back to {selectedSubCategory}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice</h1>
          <p className="text-gray-600 text-lg">Live mock interview exercises with AI feedback</p>
        </div>

        {/* Sub-category Selection */}
        <Card3D>
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSubSubCategory}</h2>
              <p className="text-gray-600">Choose a specific specialization</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Sub-categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Specialization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getSubSubSubCategories(selectedCategory, selectedSubCategory, selectedSubSubCategory).map((subSubSubCategory) => (
                    <div
                      key={subSubSubCategory}
                      onClick={() => handleSubSubSubCategorySelect(subSubSubCategory)}
                      className="px-4 py-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <span className="text-sm text-gray-700 font-medium">{subSubSubCategory}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Info */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">5 Questions</div>
                  <div className="text-sm text-gray-600">Per session</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">15-20 mins</div>
                  <div className="text-sm text-gray-600">Estimated duration</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-gray-900 text-lg font-semibold">AI Feedback</div>
                  <div className="text-sm text-gray-600">Instant analysis</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-8 py-3 text-gray-600 border-gray-300 hover:bg-gray-50 bg-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="text-center text-gray-500 text-sm flex items-center">
                  Select a specialization above to continue
                </div>
              </div>
            </div>
          </div>
        </Card3D>
      </div>
    )
  }

  return null
}
