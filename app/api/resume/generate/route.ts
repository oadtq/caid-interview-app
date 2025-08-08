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
    const resumeData = await request.json()

    const {
      personalInfo,
      experience,
      education,
      skills,
      certifications,
      languages,
      targetJob,
      targetIndustry
    } = resumeData

    // Generate AI-optimized resume content
    const generationPrompt = `
You are an expert resume writer. Create a professional, ATS-optimized resume based on the following information:

Personal Information:
- Name: ${personalInfo.firstName} ${personalInfo.lastName}
- Email: ${personalInfo.email}
- Phone: ${personalInfo.phone}
- Location: ${personalInfo.location}
- LinkedIn: ${personalInfo.linkedin}
- Website: ${personalInfo.website}

Target Position: ${targetJob}
Target Industry: ${targetIndustry}

Professional Experience:
${experience.map((exp: any, index: number) => `
${index + 1}. ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})
   Location: ${exp.location}
   Description: ${exp.description}
`).join('\n')}

Education:
${education.map((edu: any, index: number) => `
${index + 1}. ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.graduationYear})
   GPA: ${edu.gpa || 'N/A'}
   Relevant Coursework: ${edu.relevantCoursework || 'N/A'}
`).join('\n')}

Skills: ${skills.join(', ')}

Certifications: ${certifications.map((cert: any) => `${cert.name} (${cert.year})`).join(', ')}

Languages: ${languages.map((lang: any) => `${lang.language} (${lang.proficiency})`).join(', ')}

Please create an optimized resume with:
1. A compelling professional summary (3-4 lines)
2. Enhanced job descriptions using the "Accomplished [X] as measured by [Y], by doing [Z]" format where possible
3. Quantified achievements and impact statements
4. Industry-relevant keywords for ATS optimization
5. Skills organized by relevance to the target role

Respond in JSON format:
{
  "professional_summary": "compelling 3-4 line summary",
  "experience": [
    {
      "jobTitle": "title",
      "company": "company",
      "location": "location", 
      "startDate": "date",
      "endDate": "date",
      "enhanced_description": "AI-enhanced description with quantified achievements",
      "key_achievements": ["achievement 1", "achievement 2", "achievement 3"]
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "industry_specific": ["skill1", "skill2"]
  },
  "education": [enhanced education entries],
  "certifications": [enhanced certification entries],
  "languages": [language entries],
  "keywords_added": ["keyword1", "keyword2", "keyword3"],
  "optimization_notes": "notes about optimizations made"
}
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer specializing in ATS optimization and quantified achievements. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: generationPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    let generatedContent
    try {
      generatedContent = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to generate resume content' },
        { status: 500 }
      )
    }

    // Store in Supabase
    const { data: resumeResult, error: dbError } = await supabase
      .from('generated_resumes')
      .insert({
        user_id: 'demo-user',
        resume_data: resumeData,
        generated_content: generatedContent,
        target_job: targetJob,
        target_industry: targetIndustry
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save generated resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      resumeId: resumeResult.id,
      generatedContent
    })

  } catch (error) {
    console.error('Resume generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
