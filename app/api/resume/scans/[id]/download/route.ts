import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request, context: any) {
  try {
    const { params } = context as { params: Promise<{ id: string }> }
    const { id: scanId } = await params

    const { data: scan, error } = await supabase
      .from('resume_scans')
      .select('*')
      .eq('id', scanId)
      .eq('user_id', 'demo-user') // For MVP, using demo user
      .single()

    if (error || !scan) {
      console.error('Fetch scan error:', error)
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      )
    }

    // Create a comprehensive report
    const report = {
      fileName: scan.filename,
      scanDate: scan.created_at,
      overallScore: scan.overall_score,
      aiFeedback: scan.ai_feedback,
      extractedText: scan.extracted_text
    }

    // Convert to JSON string
    const reportJson = JSON.stringify(report, null, 2)
    
    // Create blob and return as downloadable file
    const blob = new Blob([reportJson], { type: 'application/json' })
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${scan.filename.replace('.pdf', '')}_analysis.json"`
      }
    })

  } catch (error) {
    console.error('Download scan API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 