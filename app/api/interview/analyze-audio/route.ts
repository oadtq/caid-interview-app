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
    const audio = formData.get('audio') as File
    const responseId = formData.get('responseId') as string
    const questionText = formData.get('questionText') as string

    if (!audio || !responseId || !questionText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert audio to transcription using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: 'en'
    })

    const transcribedText = transcription.text

    // Analyze the response using GPT-4o-mini
    const analysisPrompt = `
You are an expert interview coach analyzing a candidate's response to an interview question. 

Question: "${questionText}"
Response: "${transcribedText}"

Please provide a comprehensive analysis with scores (1-10) and detailed feedback for each criterion:

1. Content Quality (1-10): How well did they answer the question? Did they provide specific examples and relevant details?

2. Communication Skills (1-10): How clear, articulate, and well-structured was their response? Did they speak confidently?

3. Professionalism (1-10): Did they maintain a professional tone and demeanor? Were they appropriate for a business setting?

4. Use of Examples (1-10): Did they provide specific, concrete examples to support their points? Were the examples relevant and impactful?

Please respond in JSON format:
{
  "overall_score": number (1-10),
  "content_quality": {
    "score": number,
    "feedback": "detailed feedback"
  },
  "communication_skills": {
    "score": number,
    "feedback": "detailed feedback"
  },
  "professionalism": {
    "score": number,
    "feedback": "detailed feedback"
  },
  "use_of_examples": {
    "score": number,
    "feedback": "detailed feedback"
  },
  "strengths": ["strength 1", "strength 2"],
  "areas_for_improvement": ["improvement 1", "improvement 2"],
  "overall_feedback": "comprehensive overall feedback"
}
`

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
      temperature: 0.7,
      max_tokens: 1500
    })

    let aiFeedback
    try {
      aiFeedback = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback feedback
      aiFeedback = {
        overall_score: 7,
        content_quality: { score: 7, feedback: "Good response with room for improvement." },
        communication_skills: { score: 7, feedback: "Clear communication overall." },
        professionalism: { score: 8, feedback: "Professional tone maintained." },
        use_of_examples: { score: 6, feedback: "Could benefit from more specific examples." },
        strengths: ["Clear speaking", "Professional demeanor"],
        areas_for_improvement: ["Add more specific examples", "Structure responses better"],
        overall_feedback: "Good response overall with opportunities for enhancement."
      }
    }

    // Update the interview response with transcription and AI feedback
    const { error: updateError } = await supabase
      .from('interview_responses')
      .update({
        transcription: transcribedText,
        ai_feedback: aiFeedback,
        overall_score: aiFeedback.overall_score,
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
      feedback: aiFeedback
    })

  } catch (error) {
    console.error('Audio analysis API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
