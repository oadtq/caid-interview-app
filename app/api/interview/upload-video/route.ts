import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${sessionId}/${questionId}_${timestamp}.webm`

    // Upload video to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('interview-videos')
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
      .from('interview-videos')
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
    const { error: updateError } = await supabase
      .from('interview_sessions')
      .update({ 
        completed_questions: supabase.sql`completed_questions + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (updateError) {
      console.error('Session update error:', updateError)
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
