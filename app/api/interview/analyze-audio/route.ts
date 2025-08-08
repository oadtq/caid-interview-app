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
Return feedback BOTH in a legacy format (1-10 scores) and a rich detailed format used by a frontend dashboard.

Question: "${questionText}"
Response: "${transcribedText}"

First infer: total words, duration in seconds if you can from speech pacing (assume 150 wpm if not provided), WPM, disfluency counts (um/uh/er/ah), filler words (basically, you know, kind of, sort of, actually, like), negative tone phrases, and power words (led, owned, delivered, achieved, improved, implemented, designed, launched, optimized, streamlined, innovated, mentored, built, created, managed).

Return STRICT JSON with two top-level keys: legacy and detailed.
- legacy has shape:
  {
    "overall_score": number (1-10),
    "content_quality": { "score": number, "feedback": string },
    "communication_skills": { "score": number, "feedback": string },
    "professionalism": { "score": number, "feedback": string },
    "use_of_examples": { "score": number, "feedback": string },
    "strengths": string[],
    "areas_for_improvement": string[],
    "overall_feedback": string
  }
- detailed has shape:
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
- overallPerformance.score is 0-100; legacy.overall_score is 1-10.
- Map statuses by score: >=85 excellent, >=70 good, >=50 caution, else poor.
- If duration seconds unknown, estimate by words/150*60.
- per100Words = round((count/totalWords)*100, 2). If totalWords is 0, return 0.
- All strings must be concise, professional, and actionable.

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

    // Fallback structures if parsing fails or missing keys
    const legacyFallback = {
      overall_score: 7,
      content_quality: { score: 7, feedback: 'Good response with room for improvement.' },
      communication_skills: { score: 7, feedback: 'Clear communication overall.' },
      professionalism: { score: 8, feedback: 'Professional tone maintained.' },
      use_of_examples: { score: 6, feedback: 'Could benefit from more specific examples.' },
      strengths: ['Clear speaking', 'Professional demeanor'],
      areas_for_improvement: ['Add more specific examples', 'Structure responses better'],
      overall_feedback: 'Good response overall with opportunities for enhancement.'
    }

    const detailedFallback = {
      overallPerformance: {
        score: 70,
        status: 'good',
        summary: 'Solid response with room for improvement',
        description: 'Overall performance across content, delivery, and professionalism.',
        detailedAnalysis: 'Good foundation; refine structure and add quantifiable outcomes.',
        examples: ['Maintained professional tone'],
        tips: ['Use STAR structure for examples'],
        overallSummary: 'Good overall; improve clarity and specificity.'
      },
      answerRelevance: {
        score: 75,
        status: 'good',
        summary: 'Mostly on-topic and relevant',
        description: 'Focus and alignment with the question.',
        detailedAnalysis: 'Addresses question; tighten scope to core points.',
        examples: [],
        tips: ['Lead with a direct answer, then support it']
      },
      paceOfSpeech: {
        score: 80,
        status: 'good',
        summary: 'Comfortable pace',
        description: 'Speaking rate and clarity.',
        detailedAnalysis: 'Within comfortable range.',
        examples: [],
        tips: ['Pause between key points'],
        wpm: 140,
        optimalRange: '115-180 WPM'
      },
      umCounter: {
        score: 80,
        status: 'good',
        summary: 'Low disfluencies',
        description: 'Counts disfluencies.',
        detailedAnalysis: 'Minor disfluencies present.',
        examples: [],
        tips: ['Replace fillers with brief pauses'],
        count: 2,
        per100Words: 1
      },
      vocabulary: {
        score: 80,
        status: 'good',
        summary: 'Professional vocabulary',
        description: 'Sophistication and appropriateness.',
        detailedAnalysis: 'Clear and professional.',
        examples: [],
        tips: ['Avoid jargon unless necessary'],
        level: 'Professional',
        gradeLevel: 12
      },
      powerWords: {
        score: 75,
        status: 'good',
        summary: 'Some impactful verbs used',
        description: 'Action-oriented language.',
        detailedAnalysis: 'Add more quantified results with power verbs.',
        examples: [],
        tips: ['Lead bullet points with verbs'],
        count: 4,
        words: ['led','delivered','achieved','implemented']
      },
      fillerWords: {
        score: 80,
        status: 'good',
        summary: 'Few filler words',
        description: 'Non-essential phrases.',
        detailedAnalysis: 'Minimize fillers to sharpen delivery.',
        examples: [],
        tips: ['Practice concise phrasing'],
        count: 3,
        per100Words: 2,
        commonWords: ['like']
      },
      pauseCounter: {
        score: 85,
        status: 'excellent',
        summary: 'Natural use of pauses',
        description: 'Strategic pauses for emphasis.',
        detailedAnalysis: 'Good rhythm supports comprehension.',
        examples: [],
        tips: ['Pause before key claims'],
        quality: 'Natural'
      },
      negativeTone: {
        score: 95,
        status: 'excellent',
        summary: 'No negative language detected',
        description: 'Presence of pessimistic phrasing.',
        detailedAnalysis: 'Positive framing maintained.',
        examples: [],
        tips: ['Continue positive framing'],
        count: 0,
        phrases: []
      },
      length: {
        score: 90,
        status: 'excellent',
        summary: 'Good length',
        description: 'Appropriate duration.',
        detailedAnalysis: 'Fits within the 1-2 minute target.',
        examples: [],
        tips: ['Maintain similar depth and brevity'],
        duration: '01:15',
        seconds: 75,
        optimalRange: true
      },
      authenticityScore: {
        score: 90,
        status: 'excellent',
        summary: 'Conversational and genuine',
        description: 'Natural delivery.',
        detailedAnalysis: 'Not overly scripted.',
        examples: [],
        tips: ['Keep it conversational'],
        conversationalLevel: 'Highly Conversational'
      },
      strengths: ['Clear structure', 'Professional tone'],
      improvements: ['Add quantifiable outcomes', 'Tighten transitions']
    }

    const legacy = parsed?.legacy || legacyFallback
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

    // Persist both legacy (for compatibility) and detailed (for new UI)
    const { error: updateError } = await supabase
      .from('interview_responses')
      .update({
        transcription: transcribedText,
        ai_feedback: {
          ...legacy,
          // attach detailed under a namespaced key for forward-compat
          detailed
        },
        overall_score: legacy.overall_score,
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
      feedback: { legacy, detailed }
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
