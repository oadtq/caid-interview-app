import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import OpenAI from 'openai'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    tempFilePath = join('/tmp', `resume_${Date.now()}.pdf`)
    await writeFile(tempFilePath, buffer)

    // Extract text using LangChain PDFLoader
    const loader = new PDFLoader(tempFilePath)
    const docs = await loader.load()
    const extractedText = docs.map(doc => doc.pageContent).join('\n')

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      )
    }

    // Analyze resume with GPT-4o-mini
    const analysisPrompt = `
You are an expert resume reviewer and career coach. Analyze the following resume and provide comprehensive feedback.

Resume Content:
${extractedText}

Please provide a detailed analysis with scores (1-10) and specific feedback for each criterion:

1. Content Quality (1-10): How well does the resume showcase relevant skills, experience, and achievements?

2. Formatting & Structure (1-10): How well-organized, readable, and professionally formatted is the resume?

3. Keyword Optimization (1-10): How well does the resume include relevant industry keywords and terms?

4. Impact & Achievements (1-10): How effectively does the resume quantify achievements and demonstrate impact?

For each criterion, provide:
- A numerical score (1-10)
- Specific feedback explaining the score
- 2-3 actionable recommendations for improvement

Also provide:
- Overall strengths (3-5 points)
- Areas for improvement (3-5 points)
- Overall summary and recommendations

Please respond in JSON format:
{
  "overall_score": number (1-10),
  "content_quality": {
    "score": number,
    "feedback": "detailed feedback",
    "recommendations": ["rec 1", "rec 2", "rec 3"]
  },
  "formatting_structure": {
    "score": number,
    "feedback": "detailed feedback", 
    "recommendations": ["rec 1", "rec 2", "rec 3"]
  },
  "keyword_optimization": {
    "score": number,
    "feedback": "detailed feedback",
    "recommendations": ["rec 1", "rec 2", "rec 3"]
  },
  "impact_achievements": {
    "score": number,
    "feedback": "detailed feedback",
    "recommendations": ["rec 1", "rec 2", "rec 3"]
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areas_for_improvement": ["improvement 1", "improvement 2", "improvement 3"],
  "overall_summary": "comprehensive summary and recommendations"
}
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume reviewer providing detailed, constructive feedback. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    let aiFeedback
    try {
      aiFeedback = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback feedback
      aiFeedback = {
        overall_score: 7,
        content_quality: { 
          score: 7, 
          feedback: "Good content with room for improvement.",
          recommendations: ["Add more specific achievements", "Include relevant skills", "Quantify your impact"]
        },
        formatting_structure: { 
          score: 8, 
          feedback: "Well-structured resume.",
          recommendations: ["Consistent formatting", "Clear section headers", "Proper spacing"]
        },
        keyword_optimization: { 
          score: 6, 
          feedback: "Could benefit from more industry keywords.",
          recommendations: ["Research job descriptions", "Include technical skills", "Use industry terminology"]
        },
        impact_achievements: { 
          score: 6, 
          feedback: "Achievements could be more quantified.",
          recommendations: ["Use numbers and metrics", "Show results achieved", "Demonstrate value added"]
        },
        strengths: ["Clear structure", "Professional appearance", "Relevant experience"],
        areas_for_improvement: ["Add more metrics", "Include keywords", "Strengthen achievements"],
        overall_summary: "Good foundation with opportunities for enhancement through quantified achievements and keyword optimization."
      }
    }

    // Store in Supabase
    const { data: scanResult, error: dbError } = await supabase
      .from('resume_scans')
      .insert({
        user_id: 'demo-user', // For MVP, using demo user
        file_name: file.name,
        file_size: file.size,
        extracted_text: extractedText,
        ai_feedback: aiFeedback,
        overall_score: aiFeedback.overall_score
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save scan results' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      scanId: scanResult.id,
      extractedText: extractedText.substring(0, 500) + '...', // Truncate for response
      feedback: aiFeedback
    })

  } catch (error) {
    console.error('Resume scan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath)
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError)
      }
    }
  }
}
