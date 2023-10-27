import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/nextauth'

// Prisma
import { prisma } from '@/lib/db'

// shadcn Components
import { buttonVariants } from '@/components/ui/button'

// Custom Components
import { AccuracyCard, ResultsCard, TimeTakenCard } from '@/components/Cards'
import { QuestionsList } from '@/components/Lists'

// Icons
import { LucideLayoutDashboard } from 'lucide-react'

// Utils
import { getAccuracy } from '@/lib/utils'

type Props = {
  params: {
    quizId: string
  }
}

const StatisticsPage = async ({params: {quizId}}: Props) => { 
  const session = await getAuthSession()

  if (!session?.user) return redirect('/')

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true }
  })

  if (!quiz) return redirect('/quiz')
  
  const accuracy = getAccuracy(quiz.quizType, quiz.questions)  

  return (
    <>
      <div className='p-8 mx-auto max-w-7xl'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>Summary Page</h2>
          <div className='flex items-center space-x-2'>
            <Link href='/dashboard' className={buttonVariants()}>
              <LucideLayoutDashboard className='mr-2' />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className='grid gap-4 mt-4 md:grid-cols-8'>          
          <ResultsCard accuracy={accuracy} />          
          <AccuracyCard accuracy={accuracy} />         
          <TimeTakenCard timeEnded={new Date()} timeStarted={quiz.timeStarted} accuracy={accuracy}/>
        </div>

        <QuestionsList questions={quiz.questions} />
      </div>
    </>
  )
}

export default StatisticsPage