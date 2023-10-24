import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/nextauth'

// Prisma
import { prisma } from '@/lib/db'

// shadcn Components
import { buttonVariants } from '@/components/ui/button'

// Custom Components
import { ResultsCard } from '@/components/Cards'

// Icons
import { LucideLayoutDashboard } from 'lucide-react'

type Props = {
  params: {
    quizId: string
  }
}

const StatisticsPage = async ({params: {quizId}}: Props) => { 
  const session = await getAuthSession()

  if (!session?.user) return redirect('/')

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId }
  })

  if (!quiz) return redirect('/quiz')

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

        <div className='grid gap-4 mt-4 md:grid-cols-7'>
          {/* Results Card */}
          <ResultsCard accuracy={55} />
          {/* Accuracy Card */}
          {/* Time Taken Card */}
        </div>
      </div>
    </>
  )
}

export default StatisticsPage