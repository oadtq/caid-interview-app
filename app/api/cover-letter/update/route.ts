import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: NextRequest) {
  try {
    const { id, content } = await request.json()

    if (!id || !content) {
      return NextResponse.json(
        { error: 'ID and content are required' },
        { status: 400 }
      )
    }

    const { data: updatedCoverLetter, error } = await supabase
      .from('cover_letters')
      .update({ content })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update cover letter' },
        { status: 500 }
      )
    }

    return NextResponse.json({ coverLetter: updatedCoverLetter })
  } catch (error) {
    console.error('Cover letter update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 