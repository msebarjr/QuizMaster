import React from 'react'
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

// Custom Components
import { OpenEnded } from '@/components/Quizzes';

type Props = {
  params: {
    quizId: string;
  }
}

const OpenEndedPage = async ({params: { quizId }}: Props) => {
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
          answer: true
        }
      }
    }
  })

  if (!quiz || quiz.quizType !== 'open_ended') return redirect('/quiz')

  return <OpenEnded quiz={quiz}/>
}

export default OpenEndedPage