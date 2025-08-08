import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const { description, degreeProgram, fieldOfStudy, school, targetRole } = await request.json()

    console.log('Education enhancement API received:', { description, degreeProgram, fieldOfStudy, school, targetRole })

    if (!description && !degreeProgram && !fieldOfStudy) {
      return NextResponse.json(
        { error: 'At least some education details are required' },
        { status: 400 }
      )
    }

    const enhancementPrompt = `
You are an expert resume writer specializing in education section optimization. Enhance the following education details to make them more impactful and relevant to the target role.

Current Education Details: "${description || ''}"
Degree Program: ${degreeProgram || 'Not specified'}
Field of Study: ${fieldOfStudy || 'Not specified'}
School: ${school || 'Not specified'}
Target Role: ${targetRole || 'Not specified'}

Please enhance this education section using these guidelines:
1. Focus on academic achievements, relevant coursework, and projects
2. Include GPA if it's 3.5 or higher
3. Add relevant extracurricular activities, leadership roles, or honors
4. Connect education to the target role when possible
5. Use bullet points for better readability
6. Include any research projects, internships, or relevant experience
7. Keep it concise but impactful (3-5 bullet points)

Respond with a JSON object:
{
  "enhanced_description": "improved education description with bullet points",
  "bullet_points": ["bullet 1", "bullet 2", "bullet 3"],
  "keywords_added": ["keyword1", "keyword2"],
  "improvements_made": ["improvement 1", "improvement 2"]
}
`

    console.log('Sending education enhancement prompt to OpenAI')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer specializing in education section optimization and ATS-friendly formatting. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: enhancementPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    })

    console.log('OpenAI education enhancement response received')

    let enhancedContent
    try {
      enhancedContent = JSON.parse(completion.choices[0].message.content || '{}')
      console.log('Parsed enhanced education content:', enhancedContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw response:', completion.choices[0].message.content)
      return NextResponse.json(
        { error: 'Failed to enhance education details' },
        { status: 500 }
      )
    }

    return NextResponse.json(enhancedContent)

  } catch (error) {
    console.error('Education enhancement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 