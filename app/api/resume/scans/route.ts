import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data: scans, error } = await supabase
      .from('resume_scans')
      .select('*')
      .eq('user_id', 'demo-user') // For MVP, using demo user
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Scans fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch scans' },
        { status: 500 }
      )
    }

    return NextResponse.json({ scans })

  } catch (error) {
    console.error('Scans API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 