import React from 'react'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'

// Custom Components
import { CreateQuizForm } from '@/components/Forms'

type Props = {}

export const metadata = {
  title: 'Quiz | QuizMaster'
}

const QuizPage = async (props: Props) => {
  const session = await getAuthSession()

  if (!session?.user) return redirect('/')

  return (
    <CreateQuizForm />
  )
}

export default QuizPage