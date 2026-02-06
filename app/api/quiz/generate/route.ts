import { NextRequest, NextResponse } from 'next/server'
import { SAMPLE_QUIZZES } from '@/lib/sample-quizzes'

// Default to Alan Turing quiz for new requests
const DEFAULT_QUIZ = SAMPLE_QUIZZES[0]

// Keep for backwards compatibility (deprecated - use SAMPLE_QUIZZES instead)
const ALAN_TURING_QUIZ = {
  id: 1,
  url: 'https://en.wikipedia.org/wiki/Alan_Turing',
  title: 'Alan Turing',
  summary:
    'Alan Turing was a British mathematician, computer scientist, logician, cryptanalyst, and philosopher. He is widely considered the father of theoretical computer science and artificial intelligence. His work during World War II played a crucial role in breaking the German Enigma code.',
  article_image: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg',
  sections: [
    {
      title: 'Early Life & Education',
      description: 'Turing studied mathematics at King\'s College, Cambridge, where he showed exceptional academic ability.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/King%27s_College%2C_Cambridge.jpg',
    },
    {
      title: 'World War II & Cryptography',
      description: 'During WWII, Turing worked at Bletchley Park and helped break the German Enigma code.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Bombe-replica.jpg',
    },
    {
      title: 'Artificial Intelligence',
      description: 'Turing proposed the famous Turing Test to determine whether a machine can exhibit intelligent behavior.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Turing_Test.png',
    },
    {
      title: 'Legacy & Impact',
      description: 'The Turing Award is named in his honor and is considered the Nobel Prize of computing.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Turing_Award.jpg',
    },
  ],
  quiz: [
    {
      question: 'Where did Alan Turing complete his undergraduate studies?',
      options: ['Harvard University', 'Cambridge University', 'Oxford University', 'Stanford University'],
      answer: 'Cambridge University',
      difficulty: 'easy' as const,
      topic: 'Early Life & Education',
      explanation: 'Alan Turing studied mathematics at King\'s College, Cambridge, as mentioned in the Early Life section.',
    },
    {
      question: 'What was the primary purpose of the Bombe machine developed by Alan Turing?',
      options: [
        'Encrypt British military messages',
        'Decode Morse code transmissions',
        'Break the German Enigma cipher',
        'Predict enemy troop movements',
      ],
      answer: 'Break the German Enigma cipher',
      difficulty: 'medium' as const,
      topic: 'World War II & Cryptography',
      explanation: 'The Bombe was designed to decrypt messages encrypted by the German Enigma machine during WWII.',
    },
    {
      question: 'What does the Turing Test evaluate?',
      options: [
        'Machine speed',
        'Machine learning accuracy',
        'Human-like intelligence in machines',
        'Hardware efficiency',
      ],
      answer: 'Human-like intelligence in machines',
      difficulty: 'medium' as const,
      topic: 'Artificial Intelligence',
      explanation: 'The Turing Test measures whether a machine can imitate human intelligence convincingly.',
    },
    {
      question: 'Which concept introduced by Turing laid the foundation for modern computing?',
      options: ['Neural Networks', 'Turing Machine', 'Binary Search', 'Compiler Design'],
      answer: 'Turing Machine',
      difficulty: 'hard' as const,
      topic: 'Artificial Intelligence',
      explanation: 'The Turing Machine is a theoretical model that defines computation and underpins computer science.',
    },
    {
      question: 'Which prestigious award is named after Alan Turing?',
      options: ['Nobel Prize', 'Fields Medal', 'Turing Award', 'Abel Prize'],
      answer: 'Turing Award',
      difficulty: 'easy' as const,
      topic: 'Legacy & Impact',
      explanation: 'The Turing Award honors major contributions to computer science.',
    },
  ],
  related_topics: [
    {
      name: 'Cryptography',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Cryptography.jpg',
    },
    {
      name: 'Enigma Machine',
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Enigma-machine.jpg',
    },
    {
      name: 'History of Computer Science',
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Computer_history_museum.jpg',
    },
    {
      name: 'Artificial Intelligence',
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Artificial_Intelligence_logo.svg',
    },
  ],
}

// Mock API route - Will be replaced with your Python FastAPI backend
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate Wikipedia URL
    if (!url.includes('wikipedia.org')) {
      return NextResponse.json(
        { error: 'Please provide a valid Wikipedia URL' },
        { status: 400 }
      )
    }

    // TODO: Replace this with actual call to your Python FastAPI backend
    // Example:
    // const response = await fetch(`${process.env.PYTHON_API_URL}/api/quiz/generate`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ url }),
    // })
    // if (!response.ok) throw new Error('Backend request failed')
    // return NextResponse.json(await response.json())

    // For now, return mock data (Alan Turing by default)
    const mockQuiz = {
      ...DEFAULT_QUIZ,
      id: Date.now(),
      url,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(mockQuiz, { status: 200 })
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
