import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: questionSets, error } = await supabase
      .from('question_sets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch question sets' },
        { status: 500 }
      )
    }

    // Parse questions JSON for each set with error handling
    const parsedQuestionSets = questionSets?.map(set => {
      try {
        return {
          ...set,
          questions: typeof set.questions === 'string' ? JSON.parse(set.questions) : set.questions || []
        }
      } catch (parseError) {
        console.error('Error parsing questions for set:', set.id, parseError)
        return {
          ...set,
          questions: []
        }
      }
    }) || []

    return NextResponse.json({ questionSets: parsedQuestionSets })
  } catch (error) {
    console.error('Error fetching question sets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question sets' },
      { status: 500 }
    )
  }
}
