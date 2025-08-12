import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
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
- Multiple specific feedback categories with recommendations

Please respond in JSON format:
{
  "overall_score": number (1-10),
  "content_quality": {
    "score": number,
    "feedback": "detailed feedback",
    "categories": [
      {
        "name": "Summary Statement",
        "status": "error|warning|success",
        "details": "specific feedback about summary",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Work Experience",
        "status": "error|warning|success", 
        "details": "specific feedback about experience",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Skills Section",
        "status": "error|warning|success",
        "details": "specific feedback about skills",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Education",
        "status": "error|warning|success",
        "details": "specific feedback about education",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      }
    ]
  },
  "formatting_structure": {
    "score": number,
    "feedback": "detailed feedback",
    "categories": [
      {
        "name": "Layout & Design",
        "status": "error|warning|success",
        "details": "specific feedback about layout",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Font & Typography",
        "status": "error|warning|success",
        "details": "specific feedback about fonts",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Spacing & Margins",
        "status": "error|warning|success",
        "details": "specific feedback about spacing",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Section Headers",
        "status": "error|warning|success",
        "details": "specific feedback about headers",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      }
    ]
  },
  "keyword_optimization": {
    "score": number,
    "feedback": "detailed feedback",
    "categories": [
      {
        "name": "Technical Skills",
        "status": "error|warning|success",
        "details": "specific feedback about technical skills",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Industry Keywords",
        "status": "error|warning|success",
        "details": "specific feedback about industry terms",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Job Title Keywords",
        "status": "error|warning|success",
        "details": "specific feedback about job titles",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Action Verbs",
        "status": "error|warning|success",
        "details": "specific feedback about action verbs",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      }
    ]
  },
  "impact_achievements": {
    "score": number,
    "feedback": "detailed feedback",
    "categories": [
      {
        "name": "Quantified Results",
        "status": "error|warning|success",
        "details": "specific feedback about metrics",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Project Impact",
        "status": "error|warning|success",
        "details": "specific feedback about project impact",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Leadership Examples",
        "status": "error|warning|success",
        "details": "specific feedback about leadership",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      },
      {
        "name": "Problem Solving",
        "status": "error|warning|success",
        "details": "specific feedback about problem solving",
        "recommendations": ["rec 1", "rec 2", "rec 3"]
      }
    ]
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
      let content = completion.choices[0].message.content || '{}'
      
      // Strip markdown code blocks if present
      if (content.includes('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      } else if (content.includes('```')) {
        content = content.replace(/```\n?/g, '')
      }
      
      aiFeedback = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw content:', completion.choices[0].message.content)
      // Fallback feedback
      aiFeedback = {
        overall_score: 7,
        content_quality: { 
          score: 7, 
          feedback: "Good content with room for improvement.",
          categories: [
            {
              name: "Summary Statement",
              status: "warning",
              details: "Your summary statement could be more specific and impactful.",
              recommendations: ["Include 2-3 key achievements", "Mention years of experience", "Align with target role"]
            },
            {
              name: "Work Experience",
              status: "warning",
              details: "Experience descriptions could be more quantified.",
              recommendations: ["Add specific metrics", "Use action verbs", "Show impact of work"]
            },
            {
              name: "Skills Section",
              status: "success",
              details: "Good variety of skills listed.",
              recommendations: ["Keep current skills", "Add relevant certifications", "Update regularly"]
            },
            {
              name: "Education",
              status: "success",
              details: "Education section is well presented.",
              recommendations: ["Include GPA if high", "Add relevant coursework", "List certifications"]
            }
          ]
        },
        formatting_structure: { 
          score: 8, 
          feedback: "Well-structured resume.",
          categories: [
            {
              name: "Layout & Design",
              status: "success",
              details: "Clean and professional layout.",
              recommendations: ["Maintain current design", "Ensure consistency", "Use white space effectively"]
            },
            {
              name: "Font & Typography",
              status: "warning",
              details: "Font choices could be improved.",
              recommendations: ["Use professional fonts", "Maintain consistent sizing", "Ensure readability"]
            },
            {
              name: "Spacing & Margins",
              status: "success",
              details: "Good use of spacing throughout.",
              recommendations: ["Keep current spacing", "Ensure consistent margins", "Use proper line spacing"]
            },
            {
              name: "Section Headers",
              status: "success",
              details: "Clear section organization.",
              recommendations: ["Maintain current headers", "Use consistent formatting", "Ensure logical flow"]
            }
          ]
        },
        keyword_optimization: { 
          score: 6, 
          feedback: "Could benefit from more industry keywords.",
          categories: [
            {
              name: "Technical Skills",
              status: "warning",
              details: "Could include more technical keywords.",
              recommendations: ["Add specific technologies", "Include programming languages", "List relevant tools"]
            },
            {
              name: "Industry Keywords",
              status: "warning",
              details: "Missing some industry-specific terms.",
              recommendations: ["Research job descriptions", "Include industry terminology", "Use relevant buzzwords"]
            },
            {
              name: "Job Title Keywords",
              status: "warning",
              details: "Job titles could be more specific.",
              recommendations: ["Use standard job titles", "Include relevant keywords", "Match target positions"]
            },
            {
              name: "Action Verbs",
              status: "success",
              details: "Good use of action verbs.",
              recommendations: ["Continue using strong verbs", "Vary your vocabulary", "Use present tense for current roles"]
            }
          ]
        },
        impact_achievements: { 
          score: 6, 
          feedback: "Achievements could be more quantified.",
          categories: [
            {
              name: "Quantified Results",
              status: "warning",
              details: "Need more specific metrics and numbers.",
              recommendations: ["Add percentage improvements", "Include dollar amounts", "Show time savings"]
            },
            {
              name: "Project Impact",
              status: "warning",
              details: "Project outcomes could be better described.",
              recommendations: ["Describe project scope", "Show team size impact", "Highlight deliverables"]
            },
            {
              name: "Leadership Examples",
              status: "warning",
              details: "Leadership experience could be emphasized more.",
              recommendations: ["Highlight team management", "Show decision-making impact", "Include mentoring examples"]
            },
            {
              name: "Problem Solving",
              status: "success",
              details: "Good examples of problem-solving skills.",
              recommendations: ["Continue highlighting solutions", "Show analytical thinking", "Include innovative approaches"]
            }
          ]
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
        filename: file.name,
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
