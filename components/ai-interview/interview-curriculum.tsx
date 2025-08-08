"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, X } from 'lucide-react'

export function InterviewCurriculum() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)

  // Video ID mapping for lessons
  const videoIds = {
    "active-listening": "HG68Ymazo18",
    "clear-speaking": "ZU9x1vFx5lI",
    "non-verbal": "0siE31sqz0Q",
    "effective-questions": "DHDrj0_bMQ0",
    "difficult-conversations": "HG68Ymazo18", // Reusing first video as fallback
    "interview-anxiety": "ZU9x1vFx5lI", // Reusing second video as fallback
    "self-confidence": "0siE31sqz0Q", // Reusing third video as fallback
    "power-posing": "DHDrj0_bMQ0", // Reusing fourth video as fallback
    "positive-self-talk": "HG68Ymazo18", // Reusing first video as fallback
    "visualization": "ZU9x1vFx5lI", // Reusing second video as fallback
    "leadership-examples": "0siE31sqz0Q", // Reusing third video as fallback
    "teamwork-scenarios": "DHDrj0_bMQ0", // Reusing fourth video as fallback
    "system-design": "HG68Ymazo18", // Reusing first video as fallback
    "coding-prep": "ZU9x1vFx5lI", // Reusing second video as fallback
  }

  const lessonsData = {
    "Communication Skills Mastery": {
      duration: "3h 15m",
      videoCount: 10,
      lessons: [
        { id: "active-listening", title: "Active Listening Techniques", duration: "12:30" },
        { id: "clear-speaking", title: "Clear and Concise Speaking", duration: "15:20" },
        { id: "non-verbal", title: "Non-Verbal Communication", duration: "18:45" },
        { id: "effective-questions", title: "Asking Effective Questions", duration: "14:10" },
        { id: "difficult-conversations", title: "Handling Difficult Conversations", duration: "20:15" }
      ]
    },
    "Confidence Building": {
      duration: "2h 45m",
      videoCount: 8,
      lessons: [
        { id: "interview-anxiety", title: "Overcoming Interview Anxiety", duration: "16:40" },
        { id: "self-confidence", title: "Building Self-Confidence", duration: "13:25" },
        { id: "power-posing", title: "Power Posing Techniques", duration: "11:50" },
        { id: "positive-self-talk", title: "Positive Self-Talk", duration: "14:30" },
        { id: "visualization", title: "Visualization Exercises", duration: "12:20" }
      ]
    }
  }

  const playbooksData = {
    "Behavioral Questions Playbook": {
      duration: "1h 45m",
      videoCount: 6,
      lessons: [
        { id: "leadership-examples", title: "Leadership Examples", duration: "12:30" },
        { id: "teamwork-scenarios", title: "Teamwork Scenarios", duration: "15:20" }
      ]
    },
    "Technical Interview Playbook": {
      duration: "2h 20m",
      videoCount: 6,
      lessons: [
        { id: "system-design", title: "System Design Basics", duration: "25:15" },
        { id: "coding-prep", title: "Coding Interview Prep", duration: "22:40" }
      ]
    }
  }

  const handlePlayVideo = (lessonId: string) => {
    const videoId = videoIds[lessonId as keyof typeof videoIds]
    if (videoId) {
      setCurrentVideoId(videoId)
      setIsVideoModalOpen(true)
    }
  }

  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
    setCurrentVideoId(null)
  }

  const LessonItem = ({ lesson }: { lesson: any }) => (
    <div className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
      <div 
        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
        onClick={() => handlePlayVideo(lesson.id)}
      >
        <Play className="h-4 w-4 text-gray-600" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{lesson.title}</div>
        <div className="text-sm text-gray-500">{lesson.duration}</div>
      </div>
    </div>
  )

  const CategoryCard = ({ title, data, type }: { title: string, data: any, type: string }) => (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{data.duration}</span>
          <span>{data.videoCount} videos</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.lessons.map((lesson: any) => (
          <LessonItem key={lesson.id} lesson={lesson} />
        ))}
        <div className="pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => {
             if (data.lessons && data.lessons.length > 0) {
               handlePlayVideo(data.lessons[0].id)
             }
           }}>
             Start Lesson
           </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Curriculum</h1>
        <p className="text-gray-600">Structured learning paths to master interview skills</p>
      </div>

      {/* Lessons Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(lessonsData).map(([title, data]) => (
            <CategoryCard key={title} title={title} data={data} type="lesson" />
          ))}
        </div>
      </div>

      {/* Playbooks Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Playbooks</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(playbooksData).map(([title, data]) => (
            <CategoryCard key={title} title={title} data={data} type="playbook" />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && currentVideoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Video Lesson</h3>
              <button
                onClick={closeVideoModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
