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

// Helper: extract the first valid top-level JSON object from a possibly noisy string
function extractFirstJsonObject(text: string): string | null {
  let isInString = false
  let escapeNext = false
  let depth = 0
  let startIndex: number | null = null

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (escapeNext) {
      escapeNext = false
      continue
    }

    if (char === '\\') {
      escapeNext = true
      continue
    }

    if (char === '"') {
      isInString = !isInString
      continue
    }

    if (isInString) continue

    if (char === '{') {
      if (depth === 0) {
        startIndex = i
      }
      depth++
    } else if (char === '}') {
      if (depth > 0) {
        depth--
        if (depth === 0 && startIndex !== null) {
          const candidate = text.slice(startIndex, i + 1)
          try {
            JSON.parse(candidate)
            return candidate
          } catch {
            // keep scanning for the next balanced candidate
          }
        }
      }
    }
  }

  return null
}

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
You are an expert resume analyst and career coach specializing in entry-level and internship applications for students from VinUniversity, Vietnam.
Evaluate the provided resume using a detailed scoring rubric and comprehensive, actionable feedback.
Ensure a strict, evidence-based review to help the student substantially enhance their resume.

Resume Content:
${extractedText}

Perform an in-depth review of the resume, scoring each criterion from 1 to 10 (integers only). For each criterion, provide:
- An explicit integer score (1–10)
- A thorough explanation justifying the score, with direct references to the resume
- Organized category-level feedback with recommendations, including at least five actionable and detailed suggestions for revision per category

Assessment Criteria:
1. Content Quality (1-10): Evaluation of relevant skills, experience, and accomplishments
2. Formatting & Structure (1-10): Assessment of organization, readability, and professional formatting
3. Keyword Optimization (1-10): Extent of industry-related keywords and terminology
4. Impact & Achievements (1-10): How clearly results, metrics, and demonstrated impact are presented

For each major section (Summary Statement, Work Experience, Skills Section, Education), and all subcategories, if a section is incomplete or missing, note this in 'details' and provide explicit recommendations for correction. Ensure that all feedback and 'details' fields are sufficiently in-depth, with extended critical analysis directly referencing the resume, and contain at least five recommendations each, elaborating on specific points for improvement or enhancement.
If the resume (${extractedText}) is empty, malformed, contains images/tables/non-text content, or other issues, reflect these in feedback and offer specific advice for remedying the input file.

After completing your evaluation, explicitly verify that all required sections and scores are present, and confirm that feedback refers directly to the resume content. Self-correct any omissions or inconsistencies.

## Output Format
Return output strictly in the JSON structure outlined below. Include all arrays, objects, and fields as required, preserving specified ordering. If a section is missing or data is unavailable, specify this in 'details' and use status 'error'.
{
  "overall_score": number (1-10),
  "content_quality": {
    "score": integer (1-10),
    "feedback": "very detailed feedback with extended analysis",
    "categories": [
      {
        "name": "Summary Statement",
        "status": "error|warning|success",
        "details": "specific feedback about summary, pointing out directly from resume",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Work Experience",
        "status": "error|warning|success", 
        "details": "specific feedback about experience, pointing out directly from resume",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Skills Section",
        "status": "error|warning|success",
        "details": "specific feedback about skills, pointing out directly from resume",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Education",
        "status": "error|warning|success",
        "details": "specific feedback about education, pointing out directly from resume",
        "recommendations": ["at least five actionable and specific recommendations"]
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
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Font & Typography",
        "status": "error|warning|success",
        "details": "specific feedback about fonts",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Spacing & Margins",
        "status": "error|warning|success",
        "details": "specific feedback about spacing",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Section Headers",
        "status": "error|warning|success",
        "details": "specific feedback about headers",
        "recommendations": ["at least five actionable and specific recommendations"]
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
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Industry Keywords",
        "status": "error|warning|success",
        "details": "specific feedback about industry terms",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Job Title Keywords",
        "status": "error|warning|success",
        "details": "specific feedback about job titles",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Action Verbs",
        "status": "error|warning|success",
        "details": "specific feedback about action verbs",
        "recommendations": ["at least five actionable and specific recommendations"]
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
        "details": "specific feedback about metrics, pointing out directly from resume",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Project Impact",
        "status": "error|warning|success",
        "details": "specific feedback about project impact, pointing out directly from resume",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Leadership Examples",
        "status": "error|warning|success",
        "details": "specific feedback about leadership, pointing out directly from resume",
        "recommendations": ["at least five actionable and specific recommendations"]
      },
      {
        "name": "Problem Solving",
        "status": "error|warning|success",
        "details": "specific feedback about problem solving, pointing out directly from resume",
        "recommendations": ["at least five actionable and specific recommendations"]
      }
    ]
  },
  "strengths": ["at least four strengths, each well-explained"],
  "areas_for_improvement": ["at least four improvements, each well-explained"],
  "overall_summary": "comprehensive summary and recommendations, pointing out directly from resume"
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
      response_format: { type: 'json_object' }
    })

    let aiFeedback
    try {
      let content = completion.choices[0].message.content || '{}'
      content = content.trim()
      
      // Strip markdown code blocks if present
      if (content.includes('```json')) {
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      } else if (content.includes('```')) {
        content = content.replace(/```\n?/g, '')
      }

      // Try direct parse first
      try {
        aiFeedback = JSON.parse(content)
      } catch {
        // Attempt to extract first valid JSON object from noisy output
        const extracted = extractFirstJsonObject(content)
        if (extracted) {
          aiFeedback = JSON.parse(extracted)
        } else {
          throw new Error('No valid JSON object found in model response')
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw content:', completion.choices[0].message.content)
      // Fallback feedback
      aiFeedback = {
        overall_score: 0,
        content_quality: { 
          score: 0, 
          feedback: "Unable to analyze resume content due to a possible system error or unsupported/malformed resume format. Please try again with a different file or contact support if the issue persists.",
          categories: [
            {
              name: "Summary Statement",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Check that your resume is a standard PDF with selectable text.",
                "Avoid using images or scanned documents.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Ensure your resume contains clear section headers."
              ]
            },
            {
              name: "Work Experience",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Ensure your work experience section is clearly labeled.",
                "Use standard formatting and avoid tables or images.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Provide your work experience in plain text."
              ]
            },
            {
              name: "Skills Section",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "List your skills in a clear, text-based section.",
                "Avoid using images or graphics for skills.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Ensure your skills section is easy to find."
              ]
            },
            {
              name: "Education",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Clearly label your education section.",
                "Use standard text formatting.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Include your degree, institution, and graduation date."
              ]
            }
          ]
        },
        formatting_structure: { 
          score: 0, 
          feedback: "Unable to analyze formatting and structure due to a possible system error or unsupported/malformed resume format.",
          categories: [
            {
              name: "Layout & Design",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Use a simple, clean layout.",
                "Avoid using images or scanned documents.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Ensure all sections are clearly separated."
              ]
            },
            {
              name: "Font & Typography",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Use standard, readable fonts.",
                "Avoid decorative or script fonts.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Ensure consistent font size throughout."
              ]
            },
            {
              name: "Spacing & Margins",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Use standard margins and spacing.",
                "Avoid crowding text or using unusual layouts.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Ensure there is enough white space for readability."
              ]
            },
            {
              name: "Section Headers",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Clearly label each section.",
                "Use bold or larger font for headers.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Ensure headers are consistent throughout."
              ]
            }
          ]
        },
        keyword_optimization: { 
          score: 0, 
          feedback: "Unable to analyze keyword optimization due to a possible system error or unsupported/malformed resume format.",
          categories: [
            {
              name: "Technical Skills",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "List technical skills in plain text.",
                "Avoid using images or graphics.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Ensure skills are relevant to your target job."
              ]
            },
            {
              name: "Industry Keywords",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Include industry-specific keywords in your resume.",
                "Research job descriptions for relevant terms.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Use standard terminology for your field."
              ]
            },
            {
              name: "Job Title Keywords",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Use standard job titles.",
                "Match job titles to your target positions.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Ensure job titles are clearly visible."
              ]
            },
            {
              name: "Action Verbs",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Start bullet points with strong action verbs.",
                "Avoid passive language.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Use a variety of action verbs."
              ]
            }
          ]
        },
        impact_achievements: { 
          score: 0, 
          feedback: "Unable to analyze impact and achievements due to a possible system error or unsupported/malformed resume format.",
          categories: [
            {
              name: "Quantified Results",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Include numbers and metrics where possible.",
                "Show the impact of your work.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Use percentages, dollar amounts, or time saved."
              ]
            },
            {
              name: "Project Impact",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Describe the outcomes of your projects.",
                "Highlight your contributions.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Show how your work benefited the team or company."
              ]
            },
            {
              name: "Leadership Examples",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Include examples of leadership or initiative.",
                "Describe times you managed or mentored others.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Highlight decision-making responsibilities."
              ]
            },
            {
              name: "Problem Solving",
              status: "error",
              details: "No feedback available. This may be due to a system error or the resume format not being supported.",
              recommendations: [
                "Describe challenges you overcame.",
                "Show your analytical thinking.",
                "Try re-uploading your resume.",
                "Contact support if the problem continues.",
                "Include examples of innovative solutions."
              ]
            }
          ]
        },
        strengths: [
          "No strengths could be determined due to a possible system error or unsupported/malformed resume format."
        ],
        areas_for_improvement: [
          "Check that your resume is a standard PDF with selectable text.",
          "Avoid using images, tables, or scanned documents.",
          "Try re-uploading your resume.",
          "Contact support if the problem continues."
        ],
        overall_summary: "No analysis could be performed. This may be due to a system error or an unsupported or malformed resume format. Please try again with a different file or contact support if the issue persists."
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
