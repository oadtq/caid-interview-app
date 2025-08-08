"use client"

import { useEffect, useRef, useState } from "react"
import { Card3D } from "@/components/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, MessageSquare, Clock, Star, Camera, ArrowLeft, ArrowRight, Mic, Volume2, Globe, Building2, Target, GraduationCap, Check, X, Square, RotateCcw, CameraOff, MicOff, Upload } from 'lucide-react'

interface PracticeProps {
  onTabChange?: (tab: string) => void
}

interface Question {
  id: string
  text: string
  timeLimit: number
}

interface DBQuestionSet {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  questions: Question[]
}

export default function Practice({ onTabChange }: PracticeProps) {
  const [dbQuestionSets, setDbQuestionSets] = useState<DBQuestionSet[]>([])
  const [loadingSets, setLoadingSets] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [selectedSetId, setSelectedSetId] = useState<string>("")
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [hasStartedRecording, setHasStartedRecording] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle')

  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoadingSets(true)
        setFetchError(null)
        const res = await fetch('/api/interview/question-sets')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setDbQuestionSets((data.questionSets || []) as DBQuestionSet[])
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : 'Failed to fetch question sets')
        setDbQuestionSets([])
      } finally {
        setLoadingSets(false)
      }
    }
    fetchSets()
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initializeCamera = async () => {
    try {
      // Always request both video and audio; we can toggle tracks after
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const toggleCamera = () => {
    if (!stream) return
    const vt = stream.getVideoTracks()[0]
    if (vt) {
      vt.enabled = !cameraEnabled
      setCameraEnabled(!cameraEnabled)
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
    const preferredTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      ''
    ]
    const mimeType = preferredTypes.find(t => !t || MediaRecorder.isTypeSupported(t)) || 'video/webm'
    const options = mimeType ? { mimeType } as MediaRecorderOptions : undefined
    const recorder = new MediaRecorder(stream, options)
    const chunks: Blob[] = []
    recorder.ondataavailable = (ev) => {
      if (ev.data.size > 0) chunks.push(ev.data)
    }
    recorder.onstop = () => {
      setRecordedChunks(chunks)
    }
    recorder.start()
    setMediaRecorder(recorder)

    // Start parallel audio-only recorder
    const audioStream = new MediaStream(stream.getAudioTracks())
    const audioMime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', ''].find(t => !t || MediaRecorder.isTypeSupported(t)) || 'audio/webm'
    const audioOptions = audioMime ? { mimeType: audioMime } as MediaRecorderOptions : undefined
    const aRecorder = new MediaRecorder(audioStream, audioOptions)
    const aChunks: Blob[] = []
    aRecorder.ondataavailable = (ev) => {
      if (ev.data.size > 0) aChunks.push(ev.data)
    }
    aRecorder.onstop = () => {
      setAudioChunks(aChunks)
    }
    aRecorder.start()
    setAudioRecorder(aRecorder)

    setIsRecording(true)
    setRecordingTime(0)
    timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000)
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
    }
    if (audioRecorder && isRecording) {
      audioRecorder.stop()
    }
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  // No ffmpeg: we record audio in parallel using an audio-only MediaRecorder

  const uploadRecording = async () => {
    if (!currentSession || recordedChunks.length === 0) return
    setIsUploading(true)
    setUploadStatus('uploading')
    try {
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' })
      const currentQuestion = currentSession.questions[currentQuestionIndex] as Question

      const formData = new FormData()
      formData.append('video', videoBlob)
      formData.append('sessionId', currentSession.id)
      formData.append('questionId', currentQuestion.id)
      formData.append('questionText', currentQuestion.text)
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
      audioForm.append('questionText', currentQuestion.text)
      const analyzeRes = await fetch('/api/interview/analyze-audio', { method: 'POST', body: audioForm })
      if (!analyzeRes.ok) throw new Error('Analysis failed')

      setUploadStatus('complete')

      setTimeout(() => {
        if (currentQuestionIndex < currentSession.questions.length - 1) {
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
    setRecordingTime(0)
    setUploadStatus('idle')
    setHasStartedRecording(false)
    setCountdown(0)
    setIsRecording(false)
  }

  const startSession = async (setId: string) => {
    try {
      setSelectedSetId(setId)
      const selected = dbQuestionSets.find(s => s.id === setId)
      const sessionName = `Practice - ${selected?.name || 'Interview'} (${new Date().toLocaleString()})`
      const res = await fetch('/api/interview/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionName, questionSetId: setId })
      })
      if (!res.ok) throw new Error('Failed to start session')
      const data = await res.json()
      setCurrentSession({ ...data.session, questions: data.questions })
      setCurrentQuestionIndex(0)
      setIsInterviewStarted(true)
      await initializeCamera()
    } catch (e) {
      console.error('Start session error:', e)
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
    setSelectedSetId("")
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

  const RecordingInterface = () => {
    const q: Question | undefined = currentSession?.questions?.[currentQuestionIndex]
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-8">
        {/* Question Title */}
        <div className="text-center mb-6 max-w-4xl">
          <h1 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 leading-relaxed">
            {q?.text}
          </h1>
          <div className="mb-4">
            <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {currentSession?.questions?.length || 0}</span>
          </div>
          <div className="flex justify-center gap-2 mb-8">
            {currentSession?.questions?.map((_: any, idx: number) => (
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
                      if (!q?.text) return
                      try {
                        const audioRes = await fetch(`/api/interview/analyze-audio?tts=1&text=${encodeURIComponent(q.text)}`)
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
                // skip question without recording
                if (currentSession && currentQuestionIndex < currentSession.questions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                  resetRecording()
                } else {
                  if (onTabChange) onTabChange('videos')
                  else window.location.href = '/ai-interview?tab=videos'
                }
              }}
              variant="outline"
              className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50 bg-white"
            >
              Skip This Question
            </Button>
            <Button 
              onClick={() => {
                if (!isRecording && recordedChunks.length > 0 && uploadStatus === 'idle') {
                  uploadRecording()
                } else {
                  // If nothing to upload, move next
                  if (currentSession && currentQuestionIndex < currentSession.questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                    resetRecording()
                  } else {
                    if (onTabChange) onTabChange('videos')
                    else window.location.href = '/ai-interview?tab=videos'
                  }
                }
              }}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {currentSession && currentQuestionIndex === (currentSession.questions.length - 1) ? 'Finish' : 'Next Question'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isInterviewStarted && currentSession) {
    return <RecordingInterface />
  }

  if (loadingSets) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 rounded-full border-b-2 border-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading question sets...</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-red-600">{fetchError}</p>
          <Button onClick={() => location.reload()} variant="outline">Try Again</Button>
        </div>
      </div>
    )
  }

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
            <p className="text-gray-600">Select a question set and start your practice session</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Question Set Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Question Set</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbQuestionSets.map((set) => (
                  <div
                    key={set.id}
                    onClick={() => startSession(set.id)}
                    className="p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md border-gray-200 bg-gray-50 hover:border-blue-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-blue-50 rounded-full">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-2 font-medium">{set.name}</h4>
                        <p className="text-sm text-gray-600">{set.description}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="secondary" className="capitalize">{set.category}</Badge>
                          <Badge className={set.difficulty === 'easy' ? 'bg-green-100 text-green-800' : set.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                            {set.difficulty}
                          </Badge>
                          <span>{set.questions?.length || 0} questions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Info */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-gray-900 text-lg font-semibold">Multiple Questions</div>
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
              Choose a question set above to continue
            </div>
          </div>
        </div>
      </Card3D>
    </div>
  )
}
