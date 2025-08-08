'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Play, Square, RotateCcw, Clock, Video, Mic, MicOff, Camera, CameraOff, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Question {
  id: string
  text: string
  timeLimit: number
}

interface QuestionSet {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  questions: Question[]
}

export default function Practice() {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<string>('')
  const [sessionName, setSessionName] = useState('')
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle')
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchQuestionSets()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const fetchQuestionSets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/interview/question-sets')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setQuestionSets(data.questionSets || [])
    } catch (error) {
      console.error('Error fetching question sets:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch question sets')
      setQuestionSets([])
    } finally {
      setLoading(false)
    }
  }

  const startSession = async () => {
    if (!selectedQuestionSet || !sessionName.trim()) return

    try {
      const response = await fetch('/api/interview/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionName: sessionName.trim(),
          questionSetId: selectedQuestionSet
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start session')
      }

      const data = await response.json()
      setCurrentSession({ ...data.session, questions: data.questions })
      setCurrentQuestionIndex(0)
      
      // Initialize camera
      await initializeCamera()
    } catch (error) {
      console.error('Error starting session:', error)
      setError('Failed to start session. Please try again.')
    }
  }

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: cameraEnabled,
        audio: micEnabled
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setError('Failed to access camera. Please check permissions.')
    }
  }

  const toggleCamera = async () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled
        setCameraEnabled(!cameraEnabled)
      }
    }
  }

  const toggleMic = async () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !micEnabled
        setMicEnabled(!micEnabled)
      }
    }
  }

  const startRecording = () => {
    if (!stream) return

    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    })

    const chunks: Blob[] = []
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    recorder.onstop = () => {
      setRecordedChunks(chunks)
    }

    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)
    setRecordingTime(0)

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const uploadRecording = async () => {
    if (recordedChunks.length === 0 || !currentSession) return

    setIsUploading(true)
    setUploadStatus('uploading')

    try {
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' })
      const currentQuestion = currentSession.questions[currentQuestionIndex]

      const formData = new FormData()
      formData.append('video', videoBlob)
      formData.append('sessionId', currentSession.id)
      formData.append('questionId', currentQuestion.id)
      formData.append('questionText', currentQuestion.text)
      formData.append('duration', recordingTime.toString())

      const uploadResponse = await fetch('/api/interview/upload-video', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) throw new Error('Upload failed')

      const uploadData = await uploadResponse.json()
      setUploadStatus('analyzing')

      // Extract audio and analyze
      const audioBlob = await extractAudioFromVideo(videoBlob)
      const audioFormData = new FormData()
      audioFormData.append('audio', audioBlob)
      audioFormData.append('responseId', uploadData.response.id)
      audioFormData.append('questionText', currentQuestion.text)

      const analysisResponse = await fetch('/api/interview/analyze-audio', {
        method: 'POST',
        body: audioFormData
      })

      if (!analysisResponse.ok) throw new Error('Analysis failed')

      setUploadStatus('complete')
      
      // Move to next question or complete session
      setTimeout(() => {
        if (currentQuestionIndex < currentSession.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          resetRecording()
        } else {
          // Session complete
          alert('Interview session completed! Check your results in My Videos.')
        }
      }, 2000)

    } catch (error) {
      console.error('Error uploading recording:', error)
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  const extractAudioFromVideo = async (videoBlob: Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      video.src = URL.createObjectURL(videoBlob)
      video.onloadedmetadata = () => {
        // For now, just return the video blob as audio
        // In a real implementation, you'd extract audio using FFmpeg or similar
        resolve(videoBlob)
      }
    })
  }

  const resetRecording = () => {
    setRecordedChunks([])
    setRecordingTime(0)
    setUploadStatus('idle')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading question sets...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchQuestionSets} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!currentSession) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Interview Practice</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Practice with AI-powered interview questions and get instant feedback on your performance
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Start New Practice Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sessionName">Session Name</Label>
              <Input
                id="sessionName"
                placeholder="e.g., Software Engineer Practice - Round 1"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionSet">Question Set</Label>
              <Select value={selectedQuestionSet} onValueChange={setSelectedQuestionSet}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a question set" />
                </SelectTrigger>
                <SelectContent>
                  {questionSets && questionSets.length > 0 ? (
                    questionSets.map((set) => (
                      <SelectItem key={set.id} value={set.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{set.name}</span>
                          <Badge className={getDifficultyColor(set.difficulty)}>
                            {set.difficulty}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-sets" disabled>
                      No question sets available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedQuestionSet && (
              <div className="p-4 bg-gray-50 rounded-lg">
                {(() => {
                  const selectedSet = questionSets.find(set => set.id === selectedQuestionSet)
                  return selectedSet ? (
                    <div className="space-y-2">
                      <h4 className="font-semibold">{selectedSet.name}</h4>
                      <p className="text-sm text-gray-600">{selectedSet.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{selectedSet.questions?.length || 0} questions</span>
                        <Badge className={getDifficultyColor(selectedSet.difficulty)}>
                          {selectedSet.difficulty}
                        </Badge>
                        <span className="capitalize">{selectedSet.category}</span>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <Button 
              onClick={startSession}
              disabled={!selectedQuestionSet || !sessionName.trim() || questionSets.length === 0}
              className="w-full"
            >
              Start Practice Session
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = currentSession.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / currentSession.questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{currentSession.session_name}</h1>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {currentSession.questions.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progress</div>
          <div className="text-lg font-semibold">{Math.round(progress)}%</div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                </div>
              )}

              {uploadStatus !== 'idle' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 text-center space-y-3">
                    {uploadStatus === 'uploading' && (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                        <p className="font-medium">Uploading video...</p>
                      </>
                    )}
                    {uploadStatus === 'analyzing' && (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
                        <p className="font-medium">Analyzing your response...</p>
                      </>
                    )}
                    {uploadStatus === 'complete' && (
                      <>
                        <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                        <p className="font-medium">Analysis complete!</p>
                      </>
                    )}
                    {uploadStatus === 'error' && (
                      <>
                        <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
                        <p className="font-medium">Upload failed. Please try again.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCamera}
                  className={!cameraEnabled ? 'bg-red-50 border-red-200' : ''}
                >
                  {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMic}
                  className={!micEnabled ? 'bg-red-50 border-red-200' : ''}
                >
                  {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex gap-2">
                {!isRecording && recordedChunks.length === 0 && (
                  <Button onClick={startRecording} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Recording
                  </Button>
                )}
                
                {isRecording && (
                  <Button onClick={stopRecording} variant="destructive" className="flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </Button>
                )}

                {!isRecording && recordedChunks.length > 0 && uploadStatus === 'idle' && (
                  <>
                    <Button onClick={resetRecording} variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button onClick={uploadRecording} className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Submit Response
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <p className="text-lg font-medium text-blue-900">
                {currentQuestion?.text || 'Loading question...'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Time limit: {Math.floor((currentQuestion?.timeLimit || 0) / 60)}:{((currentQuestion?.timeLimit || 0) % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Tips for this question:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  Take a moment to think before speaking
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  Use specific examples and metrics when possible
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  Maintain eye contact with the camera
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  Keep your answer concise and structured
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
