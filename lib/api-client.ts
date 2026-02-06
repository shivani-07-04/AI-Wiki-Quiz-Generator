// API client for quiz endpoints
// Connects to Python FastAPI backend

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Question option structure
export interface QuestionOption {
  label: string
  text: string
}

// Quiz question structure
export interface QuizQuestion {
  id: number
  question: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  options: QuestionOption[]
  correct_answer: string
  explanation: string
}

// Article section
export interface ArticleSection {
  title: string
  content: string
  image_url?: string | null
}

// Related topic
export interface RelatedTopic {
  title: string
  url: string
  summary?: string | null
  image_url?: string | null
}

// Full quiz response from backend
export interface QuizResponse {
  id: string
  wikipedia_url: string
  article_title: string
  article_summary: string
  article_image_url?: string | null
  sections: ArticleSection[]
  quiz_data: QuizQuestion[]
  related_topics: RelatedTopic[]
  created_at: string
}

// Quiz history item
export interface QuizHistoryItem {
  id: string
  article_title: string
  wikipedia_url: string
  created_at: string
}

// History response
export interface HistoryResponse {
  total: number
  quizzes: QuizHistoryItem[]
}

// Request types
export interface GenerateQuizRequest {
  url: string
}

/**
 * Generate a quiz from a Wikipedia URL
 */
export async function generateQuiz(request: GenerateQuizRequest): Promise<QuizResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to generate quiz'
      try {
        const error = await response.json()
        errorMessage = error.detail || error.error || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const data: QuizResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred while generating the quiz')
  }
}

/**
 * Get quiz history
 */
export async function getHistory(limit: number = 50, offset: number = 0): Promise<HistoryResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const response = await fetch(`${BASE_URL}/api/quiz/history?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch history'
      try {
        const error = await response.json()
        errorMessage = error.detail || error.error || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const data: HistoryResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred while fetching history')
  }
}

/**
 * Get a specific quiz by ID
 */
export async function getQuizById(quizId: string): Promise<QuizResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch quiz'
      try {
        const error = await response.json()
        errorMessage = error.detail || error.error || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const data: QuizResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred while fetching the quiz')
  }
}
