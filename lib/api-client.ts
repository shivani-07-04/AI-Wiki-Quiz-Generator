// API client for quiz endpoints
// Update BASE_URL to point to your Python FastAPI backend

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface GenerateQuizRequest {
  url: string
}

export interface GenerateQuizResponse {
  data: {
    id?: number
    url: string
    title: string
    summary: string
    sections: string[]
    key_entities: {
      people: string[]
      organizations: string[]
      locations: string[]
    }
    quiz: Array<{
      question: string
      options: string[]
      answer: string
      difficulty: 'easy' | 'medium' | 'hard'
      explanation: string
    }>
    related_topics: string[]
    created_at?: string
  }
}

export interface HistoryResponse {
  data: Array<GenerateQuizResponse['data']>
}

export async function generateQuiz(request: GenerateQuizRequest): Promise<GenerateQuizResponse> {
  const response = await fetch(`${BASE_URL}/api/quiz/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || error.error || 'Failed to generate quiz')
  }

  return response.json()
}

export async function getHistory(): Promise<HistoryResponse> {
  const response = await fetch(`${BASE_URL}/api/quiz/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || error.error || 'Failed to fetch history')
  }

  return response.json()
}
