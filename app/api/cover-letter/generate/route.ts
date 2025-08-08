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
    
    const jobTitle = formData.get('jobTitle') as string
    const companyName = formData.get('companyName') as string
    const jobDescription = formData.get('jobDescription') as string
    const tone = formData.get('tone') as string || 'professional'
    const resumeFile = formData.get('resume') as File | null

    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { error: 'Job title and company name are required' },
        { status: 400 }
      )
    }

    let resumeContent = ''

    // Extract resume content if provided
    if (resumeFile) {
      if (resumeFile.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Only PDF files are supported for resume' },
          { status: 400 }
        )
      }

      // Save file temporarily
      const bytes = await resumeFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      tempFilePath = join('/tmp', `resume_${Date.now()}.pdf`)
      await writeFile(tempFilePath, buffer)

      // Extract text using LangChain PDFLoader
      const loader = new PDFLoader(tempFilePath)
      const docs = await loader.load()
      resumeContent = docs.map(doc => doc.pageContent).join('\n')
    }

    // Generate cover letter with GPT-4o-mini
    const generationPrompt = `
You are an expert cover letter writer. Create a compelling, personalized cover letter based on the following information:

Job Title: ${jobTitle}
Company Name: ${companyName}
Job Description: ${jobDescription || 'Not provided'}
Tone: ${tone}
${resumeContent ? `Resume Content: ${resumeContent}` : 'No resume provided'}

Please create a cover letter that:
1. Has a strong opening that grabs attention
2. Highlights relevant experience and skills from the resume (if provided)
3. Shows knowledge of the company and role
4. Demonstrates enthusiasm and cultural fit
5. Has a compelling call-to-action closing
6. Matches the requested tone: ${tone}

The cover letter should be:
- 3-4 paragraphs long
- Professional yet engaging
- Tailored specifically to this role and company
- ATS-friendly with relevant keywords

Respond in JSON format:
{
  "cover_letter": "full cover letter text",
  "key_highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "personalization_elements": ["element 1", "element 2"],
  "tone_adjustments": "how the tone was adjusted",
  "keywords_included": ["keyword1", "keyword2", "keyword3"]
}
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert cover letter writer who creates compelling, personalized cover letters. Always respond with valid JSON. Adjust your writing style based on the requested tone: professional, friendly, confident, creative, or formal.`
        },
        {
          role: 'user',
          content: generationPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    })

    let generatedContent
    try {
      generatedContent = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback content
      generatedContent = {
        cover_letter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background and passion for this field, I am confident I would be a valuable addition to your team.\n\nMy experience aligns well with the requirements for this role, and I am excited about the opportunity to contribute to ${companyName}'s continued success.\n\nThank you for considering my application. I look forward to discussing how I can contribute to your team.\n\nSincerely,\n[Your Name]`,
        key_highlights: ["Relevant experience", "Strong interest", "Cultural fit"],
        personalization_elements: ["Company name", "Role-specific content"],
        tone_adjustments: `Adjusted for ${tone} tone`,
        keywords_included: ["Experience", "Team", "Contribution"]
      }
    }

    // Store in Supabase
    const { data: coverLetterResult, error: dbError } = await supabase
      .from('cover_letters')
      .insert({
        user_id: 'demo-user',
        position: jobTitle,
        company_name: companyName,
        job_description: jobDescription,
        resume_data: resumeContent,
        tone: tone,
        content: generatedContent.cover_letter
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save cover letter' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      coverLetterId: coverLetterResult.id,
      ...generatedContent
    })

  } catch (error) {
    console.error('Cover letter generation error:', error)
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
