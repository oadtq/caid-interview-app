import { NextResponse } from 'next/server'
import questionSetsData from '@/components/ai-interview/question-sets.json'

export async function GET() {
  try {
    return NextResponse.json(questionSetsData)
  } catch (error) {
    console.error('Error loading question sets data:', error)
    return NextResponse.json({ error: 'Failed to load question sets data' }, { status: 500 })
  }
} 