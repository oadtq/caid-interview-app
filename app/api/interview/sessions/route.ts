import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { sessionName, questionSetId } = await request.json()
    
    // Get the question set
    const { data: questionSet, error: questionSetError } = await supabase
      .from('question_sets')
      .select('*')
      .eq('id', questionSetId)
      .single()

    if (questionSetError || !questionSet) {
      return NextResponse.json(
        { error: 'Question set not found' },
        { status: 404 }
      )
    }

    // Create interview session
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: 'demo-user', // For MVP, using demo user
        session_name: sessionName,
        question_set_id: questionSetId,
        total_questions: questionSet.questions.length,
        completed_questions: 0
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      session,
      questions: questionSet.questions
    })

  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: sessions, error } = await supabase
      .from('interview_sessions')
      .select(`
        *,
        interview_responses (
          id,
          question_text,
          overall_score,
          created_at
        )
      `)
      .eq('user_id', 'demo-user')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Sessions fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sessions })

  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
