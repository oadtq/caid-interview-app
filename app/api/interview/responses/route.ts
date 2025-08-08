import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    let query = supabase
      .from('interview_responses')
      .select(`
        *,
        interview_sessions (
          session_name,
          question_set_id
        )
      `)

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data: responses, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Responses fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      )
    }

    return NextResponse.json({ responses })

  } catch (error) {
    console.error('Responses API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
