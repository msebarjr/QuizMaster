import React from 'react'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'

// Custom Components
import { CreateQuizForm } from '@/components/Forms'

type Props = {
  searchParams: {
    topic?: string
  }
}

export const metadata = {
  title: 'Quiz | QuizMaster',
  description: 'AI Powered Quizzes',
}

const QuizPage = async ({searchParams}: Props) => {
  const session = await getAuthSession()

  if (!session?.user) return redirect('/')

  return (
    <CreateQuizForm topicParam={searchParams.topic ?? ''}/>
  )
}

export default QuizPage