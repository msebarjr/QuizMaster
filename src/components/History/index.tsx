import React from 'react'
import Link from 'next/link'

// Prisma
import { prisma } from '@/lib/db'

// Icons
import { Clock, CopyCheck, Edit2 } from 'lucide-react'

// shadcn Components
import { Separator } from '../ui/separator'
import { getAccuracy } from '@/lib/utils'

type Props = {
  limit: number,
  userId: string
}

const HistoryComponent = async ({limit, userId}: Props) => {
  const quizzes = await prisma.quiz.findMany({
    where: { userId },
    take: limit,
    orderBy: { timeStarted: 'desc' }
  })

  return (
    <div className='space-y-8'>      
      {quizzes.map(quiz => {        
        return (
          <>         
            <div className='flex items-center justify-between' key={quiz.id}>
              <div className='flex items-center'>
                {quiz.quizType === 'mcq' ? <CopyCheck className='mr-3'/> : <Edit2 className='mr-3' />}
                <div className='ml-4 space-y-1'>
                  <Link href={`/statistics/${quiz.id}`} className='text-base font-medium leading-none underline'>
                    {quiz.topic}
                  </Link>
                  <p className='flex items-center px-2 py-1 text-sm text-white rounded-lg w-fit bg-slate-800'>
                    <Clock className='w-4 h-4 mr-1' />
                    {new Date(quiz.timeStarted).toLocaleDateString()}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {quiz.quizType === 'mcq' ? 'MCQ' : 'Open Ended'}
                  </p>
                </div>
              </div>
            </div>
            <Separator orientation='horizontal'/>
          </>
        )
      })}
    </div>
  )
}

export default HistoryComponent