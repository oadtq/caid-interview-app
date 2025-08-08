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
You are an expert resume writer and career coach. Create a comprehensive, professional, ATS-optimized resume that stands out and gets interviews.

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

Create a professional resume with the following sections:

1. PROFESSIONAL SUMMARY (3-4 compelling sentences):
   - Start with a strong opening that captures attention
   - Include years of experience and key expertise areas
   - Mention the target role and key achievements
   - End with career objective or value proposition

2. CORE COMPETENCIES/SKILLS:
   - Group skills into Technical, Soft Skills, and Industry-Specific
   - Include relevant keywords for ATS optimization
   - Focus on skills most relevant to the target role

3. PROFESSIONAL EXPERIENCE:
   - For each role, create a compelling job description
   - Use the "Accomplished [X] as measured by [Y], by doing [Z]" format
   - Include quantifiable achievements (metrics, percentages, dollar amounts)
   - Add relevant keywords naturally throughout
   - Focus on impact and results, not just responsibilities
   - Use strong action verbs and industry-specific terminology

4. EDUCATION:
   - Format consistently with degree, institution, and graduation year
   - Include relevant coursework, GPA (if 3.5+), honors, or special projects
   - Add any certifications or additional training

5. CERTIFICATIONS & LANGUAGES:
   - List certifications with issuing organization and year
   - Include language proficiencies if relevant to the role

Respond in JSON format:
{
  "professional_summary": "compelling 3-4 line summary that hooks the reader and positions the candidate for the target role",
  "core_competencies": {
    "technical_skills": ["skill1", "skill2", "skill3"],
    "soft_skills": ["skill1", "skill2", "skill3"],
    "industry_specific": ["skill1", "skill2", "skill3"]
  },
  "experience": [
    {
      "jobTitle": "title",
      "company": "company",
      "location": "location", 
      "startDate": "date",
      "endDate": "date",
      "enhanced_description": "AI-enhanced description with quantified achievements and impact statements",
      "key_achievements": ["achievement 1", "achievement 2", "achievement 3"],
      "technologies_used": ["tech1", "tech2", "tech3"]
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "institution name",
      "graduationYear": "year",
      "gpa": "GPA if 3.5+",
      "relevant_coursework": "relevant courses or projects",
      "honors": "any honors or special achievements"
    }
  ],
  "certifications": [
    {
      "name": "certification name",
      "issuer": "issuing organization",
      "year": "year obtained"
    }
  ],
  "languages": [
    {
      "language": "language name",
      "proficiency": "proficiency level"
    }
  ],
  "keywords_added": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "optimization_notes": "detailed notes about ATS optimizations, keyword integration, and formatting improvements made"
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
