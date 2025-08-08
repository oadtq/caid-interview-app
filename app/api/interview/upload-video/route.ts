import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function ensureBucketExists(bucket: string) {
  try {
    const { data: bucketInfo } = await supabase.storage.getBucket(bucket)
    if (!bucketInfo) {
      const { error: createError } = await supabase.storage.createBucket(bucket, { public: true })
      if (createError) throw createError
    }
  } catch (e) {
    // Some self-hosted/storage versions may not support getBucket; fallback to create (idempotent)
    const { data: list, error: listError } = await supabase.storage.listBuckets()
    if (!listError) {
      const exists = (list || []).some(b => b.name === bucket)
      if (!exists) {
        const { error: createError } = await supabase.storage.createBucket(bucket, { public: true })
        if (createError) throw createError
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const video = formData.get('video') as File
    const sessionId = formData.get('sessionId') as string
    const questionId = formData.get('questionId') as string
    const questionText = formData.get('questionText') as string
    const duration = parseInt(formData.get('duration') as string)

    if (!video || !sessionId || !questionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const bucketName = 'interview-videos'
    await ensureBucketExists(bucketName)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${sessionId}/${questionId}_${timestamp}.webm`

    // Upload video to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filename, video, {
        contentType: 'video/webm',
        upsert: false
      })

    if (uploadError) {
      console.error('Video upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload video' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename)

    // Create interview response record
    const { data: response, error: responseError } = await supabase
      .from('interview_responses')
      .insert({
        session_id: sessionId,
        question_id: questionId,
        question_text: questionText,
        video_url: publicUrl,
        duration: duration
      })
      .select()
      .single()

    if (responseError) {
      console.error('Response creation error:', responseError)
      return NextResponse.json(
        { error: 'Failed to create response record' },
        { status: 500 }
      )
    }

    // Update session progress
    // Fetch current count then increment (avoids supabase.sql usage)
    const { data: existingSession, error: fetchSessionError } = await supabase
      .from('interview_sessions')
      .select('completed_questions')
      .eq('id', sessionId)
      .single()

    if (!fetchSessionError) {
      const nextCompleted = (existingSession?.completed_questions || 0) + 1
      const { error: updateError } = await supabase
        .from('interview_sessions')
        .update({ 
          completed_questions: nextCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
      if (updateError) {
        console.error('Session update error:', updateError)
      }
    }
 
    return NextResponse.json({
      response,
      videoUrl: publicUrl
    })

  } catch (error) {
    console.error('Upload video API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
