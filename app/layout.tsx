import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wikipedia Quiz Generator - AI-Powered Learning',
  description:
    'Transform Wikipedia articles into interactive quizzes powered by AI. Generate questions, test your knowledge, and track your learning journey.',
  generator: 'v0.app',
  openGraph: {
    title: 'Wikipedia Quiz Generator',
    description:
      'Create custom quizzes from any Wikipedia article using AI. Smart learning made easy.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
