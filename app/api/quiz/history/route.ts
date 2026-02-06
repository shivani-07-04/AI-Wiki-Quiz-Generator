import { NextRequest, NextResponse } from 'next/server'
import { SAMPLE_QUIZZES } from '@/lib/sample-quizzes'

// Mock API route - Will be replaced with your Python FastAPI backend
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace this with actual call to your Python FastAPI backend
    // Example:
    // const response = await fetch(`${process.env.PYTHON_API_URL}/api/quiz/history`)
    // if (!response.ok) throw new Error('Backend request failed')
    // return NextResponse.json(await response.json())

    // Mock response - returns all 5 sample quizzes
    return NextResponse.json(SAMPLE_QUIZZES, { status: 200 })
  } catch (error) {
    console.error('Error fetching quiz history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz history' },
      { status: 500 }
    )
  }
}
