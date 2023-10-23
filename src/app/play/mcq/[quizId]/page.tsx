import React from 'react'
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

// Custom Components
import { MCQ } from '@/components/Quizzes';

type Props = {
  params: {
    quizId: string;
  }
}

const MCQPage = async ({params: { quizId }}: Props) => {
  const session = await getAuthSession()

  if (!session?.user) return redirect('/')

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true
        }
      }
    }
  })

  if (!quiz || quiz.quizType !== 'mcq') return redirect('/quiz')

  return <MCQ quiz={quiz}/>
}

export default MCQPage