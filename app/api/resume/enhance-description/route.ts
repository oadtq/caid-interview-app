import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const { description, jobTitle, company, targetRole } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    const enhancementPrompt = `
You are an expert resume writer. Enhance the following job description to make it more impactful and ATS-friendly.

Current Description: "${description}"
Job Title: ${jobTitle}
Company: ${company}
Target Role: ${targetRole || 'Not specified'}

Please enhance this description using these guidelines:
1. Use the "Accomplished [X] as measured by [Y], by doing [Z]" format where possible
2. Add quantifiable metrics and achievements (use realistic estimates if specific numbers aren't provided)
3. Include relevant keywords for the target role
4. Make it more action-oriented with strong verbs
5. Keep it concise but impactful (3-5 bullet points)

Respond with a JSON object:
{
  "enhanced_description": "improved description",
  "bullet_points": ["bullet 1", "bullet 2", "bullet 3"],
  "keywords_added": ["keyword1", "keyword2"],
  "improvements_made": ["improvement 1", "improvement 2"]
}
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer specializing in quantified achievements and ATS optimization. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: enhancementPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    let enhancedContent
    try {
      enhancedContent = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to enhance description' },
        { status: 500 }
      )
    }

    return NextResponse.json(enhancedContent)

  } catch (error) {
    console.error('Description enhancement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
