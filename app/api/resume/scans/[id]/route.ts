import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scanId = params.id

    const { error } = await supabase
      .from('resume_scans')
      .delete()
      .eq('id', scanId)
      .eq('user_id', 'demo-user') // For MVP, using demo user

    if (error) {
      console.error('Delete scan error:', error)
      return NextResponse.json(
        { error: 'Failed to delete scan' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete scan API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 