import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function parseStoragePathFromPublicUrl(url: string | null): { bucket: string; path: string } | null {
  if (!url) return null
  try {
    // Expected format: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
    const marker = '/storage/v1/object/public/'
    const idx = url.indexOf(marker)
    if (idx === -1) return null
    const after = url.substring(idx + marker.length)
    const firstSlash = after.indexOf('/')
    if (firstSlash === -1) return null
    const bucket = after.substring(0, firstSlash)
    const path = after.substring(firstSlash + 1)
    return { bucket, path }
  } catch {
    return null
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { params } = context as { params: { id: string } }
    const id = params.id

    // Fetch record to get video URL and session id
    const { data: record, error: fetchErr } = await supabase
      .from('interview_responses')
      .select('id, video_url, session_id')
      .eq('id', id)
      .single()

    if (fetchErr || !record) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 })
    }

    // Attempt to delete storage object if present
    const parsed = parseStoragePathFromPublicUrl(record.video_url)
    if (parsed) {
      const { error: storageErr } = await supabase.storage
        .from(parsed.bucket)
        .remove([parsed.path])
      if (storageErr) {
        console.error('Storage delete error:', storageErr)
        // Continue even if storage deletion fails
      }
    }

    // Delete DB record
    const { error: deleteErr } = await supabase
      .from('interview_responses')
      .delete()
      .eq('id', id)

    if (deleteErr) {
      console.error('DB delete error:', deleteErr)
      return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 })
    }

    // Decrement session completed_questions if applicable
    if (record.session_id) {
      const { data: sessionData, error: sessionFetchErr } = await supabase
        .from('interview_sessions')
        .select('completed_questions')
        .eq('id', record.session_id)
        .single()

      if (!sessionFetchErr && sessionData) {
        const nextCompleted = Math.max(0, (sessionData.completed_questions || 0) - 1)
        const { error: sessionUpdateErr } = await supabase
          .from('interview_sessions')
          .update({ completed_questions: nextCompleted, updated_at: new Date().toISOString() })
          .eq('id', record.session_id)
        if (sessionUpdateErr) {
          console.error('Session decrement error:', sessionUpdateErr)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete response API error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 