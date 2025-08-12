import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    let audio = formData.get('audio') as File
    const responseId = formData.get('responseId') as string
    const questionText = formData.get('questionText') as string

    if (!audio || !responseId || !questionText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Ensure the file has a filename and suitable type for Whisper
    if (!(audio as any).name) {
      audio = new File([audio], 'audio.webm', { type: (audio as any).type || 'audio/webm' })
    }

    // Convert audio to transcription using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: 'gpt-4o-mini-transcribe'
    })

    const transcribedText = transcription.text || ''

    // Ask for rich, structured feedback compatible with the new UI
    const analysisPrompt = `
You are an expert interview coach analyzing a candidate's response to an interview question.
The candidate is a student at VinUniversity from Vietnam.
Return feedback in a rich detailed format used by a frontend dashboard.

Question: "${questionText}"
Response: "${transcribedText}"

First infer: total words, duration in seconds if you can from speech pacing (assume 150 wpm if not provided), WPM, disfluency counts (um/uh/er/ah), filler words (basically, you know, kind of, sort of, actually, like), negative tone phrases, and power words (led, owned, delivered, achieved, improved, implemented, designed, launched, optimized, streamlined, innovated, mentored, built, created, managed).

Return STRICT JSON with top-level keys:
  {
    "overallPerformance": { "score": number (0-100), "status": "excellent"|"good"|"caution"|"poor", "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "overallSummary": string },
    "answerRelevance": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[] },
    "paceOfSpeech": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "wpm": number, "optimalRange": string },
    "umCounter": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "count": number, "per100Words": number },
    "vocabulary": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "level": string, "gradeLevel": number },
    "powerWords": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "count": number, "words": string[] },
    "fillerWords": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "count": number, "per100Words": number, "commonWords": string[] },
    "pauseCounter": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "quality": string },
    "negativeTone": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "count": number, "phrases": string[] },
    "length": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "duration": string, "seconds": number, "optimalRange": boolean },
    "authenticityScore": { "score": number, "status": string, "summary": string, "description": string, "detailedAnalysis": string, "examples": string[], "tips": string[], "conversationalLevel": string },
    "strengths": string[],
    "improvements": string[]
  }

Rules:
- overallPerformance.score is 0-100.
- Map statuses by score: >=85 excellent, >=70 good, >=50 caution, else poor.
- If duration seconds unknown, estimate by words/150*60.
- per100Words = round((count/totalWords)*100, 2). If totalWords is 0, return 0.
- All strings must be detailed, professional, and actionable.

Respond with JSON only.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach providing detailed, constructive feedback on interview responses. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1800
    })

    let parsed: any = null
    try {
      parsed = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
    }

    const detailedFallback = {
      overallPerformance: {
        score: 0,
        status: 'poor',
        summary: 'No response detected. This low score may be due to a system error or no audio was provided. If you believe this is a mistake, please report the issue.',
        description: 'Overall performance across content, delivery, and professionalism.',
        detailedAnalysis: 'No answer was detected, so no feedback can be provided. This may be due to a technical issue or no audio input.',
        examples: [],
        tips: ['Ensure your microphone is working and try again'],
        overallSummary: 'No response detected; please check your setup or report a possible system failure.'
      },
      answerRelevance: {
        score: 0,
        status: 'poor',
        summary: 'No relevant answer detected',
        description: 'Focus and alignment with the question.',
        detailedAnalysis: 'No content was provided to assess relevance.',
        examples: [],
        tips: ['Speak clearly and answer the question directly']
      },
      paceOfSpeech: {
        score: 0,
        status: 'poor',
        summary: 'No speech detected',
        description: 'Speaking rate and clarity.',
        detailedAnalysis: 'No words detected to analyze pace.',
        examples: [],
        tips: ['Speak at a natural pace'],
        wpm: 0,
        optimalRange: '115-180 WPM'
      },
      umCounter: {
        score: 0,
        status: 'poor',
        summary: 'No disfluencies detected',
        description: 'Counts disfluencies.',
        detailedAnalysis: 'No speech detected to analyze disfluencies.',
        examples: [],
        tips: ['Speak clearly and avoid filler words'],
        count: 0,
        per100Words: 0
      },
      vocabulary: {
        score: 0,
        status: 'poor',
        summary: 'No vocabulary detected',
        description: 'Sophistication and appropriateness.',
        detailedAnalysis: 'No words detected to assess vocabulary.',
        examples: [],
        tips: ['Use professional language'],
        level: 'N/A',
        gradeLevel: 0
      },
      powerWords: {
        score: 0,
        status: 'poor',
        summary: 'No power words detected',
        description: 'Action-oriented language.',
        detailedAnalysis: 'No speech detected to analyze power words.',
        examples: [],
        tips: ['Use strong, action-oriented verbs'],
        count: 0,
        words: []
      },
      fillerWords: {
        score: 0,
        status: 'poor',
        summary: 'No filler words detected',
        description: 'Non-essential phrases.',
        detailedAnalysis: 'No speech detected to analyze filler words.',
        examples: [],
        tips: ['Minimize filler words for clarity'],
        count: 0,
        per100Words: 0,
        commonWords: []
      },
      pauseCounter: {
        score: 0,
        status: 'poor',
        summary: 'No pauses detected',
        description: 'Strategic pauses for emphasis.',
        detailedAnalysis: 'No speech detected to analyze pauses.',
        examples: [],
        tips: ['Use pauses to emphasize key points'],
        quality: 'N/A'
      },
      negativeTone: {
        score: 0,
        status: 'excellent',
        summary: 'No negative language detected',
        description: 'Presence of pessimistic phrasing.',
        detailedAnalysis: 'No speech detected; no negative language present.',
        examples: [],
        tips: ['Maintain positive framing'],
        count: 0,
        phrases: []
      },
      length: {
        score: 0,
        status: 'poor',
        summary: 'No response length detected',
        description: 'Appropriate duration.',
        detailedAnalysis: 'No audio detected to assess duration.',
        examples: [],
        tips: ['Aim for a 1-2 minute response'],
        duration: '00:00',
        seconds: 0,
        optimalRange: false
      },
      authenticityScore: {
        score: 0,
        status: 'poor',
        summary: 'No delivery detected',
        description: 'Natural delivery.',
        detailedAnalysis: 'No speech detected to assess authenticity.',
        examples: [],
        tips: ['Speak naturally and avoid reading'],
        conversationalLevel: 'N/A'
      },
      strengths: [],
      improvements: [
        'Ensure your microphone is working and audio is recorded',
        'Try again and provide a spoken response',
        'If this is a system error, please report the issue'
      ]
    }

    const detailed = parsed?.detailed || detailedFallback

    // Derive duration/wpm if missing
    const totalWords = transcribedText.trim() ? transcribedText.trim().split(/\s+/).length : 0
    const estSeconds = Math.round((totalWords / 150) * 60)
    if (!detailed.length.seconds || detailed.length.seconds <= 0) {
      detailed.length.seconds = estSeconds
      const mins = Math.floor(estSeconds / 60)
      const secs = estSeconds % 60
      detailed.length.duration = `${mins}:${secs.toString().padStart(2, '0')}`
      detailed.length.optimalRange = estSeconds >= 60 && estSeconds <= 120
      detailed.length.summary = `Duration ${detailed.length.duration}`
    }
    if (!detailed.paceOfSpeech.wpm || detailed.paceOfSpeech.wpm <= 0) {
      const mins = detailed.length.seconds > 0 ? detailed.length.seconds / 60 : 1
      detailed.paceOfSpeech.wpm = Math.round((totalWords || 180) / (mins || 1))
      detailed.paceOfSpeech.summary = `${detailed.paceOfSpeech.wpm} words per minute`
    }
    
    // Persist detailed (for new UI)
    const { error: updateError } = await supabase
      .from('interview_responses')
      .update({
        transcription: transcribedText,
        ai_feedback: {
          detailed
        },
        overall_score: detailed.overallPerformance.score,
        updated_at: new Date().toISOString()
      })
      .eq('id', responseId)

    if (updateError) {
      console.error('Response update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      transcription: transcribedText,
      feedback: detailed
    })

  } catch (error) {
    console.error('Audio analysis API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// TTS synthesis for question playback: /api/interview/analyze-audio?tts=1&text=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const isTts = searchParams.get('tts') === '1'
  if (!isTts) {
    return NextResponse.json({ ok: true })
  }
  const text = searchParams.get('text') || ''
  if (!text) {
    return NextResponse.json({ error: 'Missing text' }, { status: 400 })
  }
  try {
    // Use gpt-4o-mini-tts to generate audio (mp3)
    const speech = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: 'alloy',
      input: text
    })
    const audioArrayBuffer = await speech.arrayBuffer()
    return new NextResponse(Buffer.from(audioArrayBuffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store'
      }
    })
  } catch (e) {
    console.error('TTS error:', e)
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
  }
}
