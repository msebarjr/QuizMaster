import React from 'react'
import Link from 'next/link'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'

// shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'

// Custom Components
import HistoryComponent from '@/components/History'

// Icons
import { LucideLayoutDashboard } from 'lucide-react'

// Prisma
import { prisma } from '@/lib/db'

type Props = {}

const HistoryPage = async (props: Props) => {
  const session = await getAuthSession()

  if (!session?.user) return redirect('/')

  const quizCount = await prisma.quiz.count({
    where: { userId: session.user.id }
  })

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-bold'>
              History
            </CardTitle>
            <Link href='/dashboard' className={buttonVariants()}>
              <LucideLayoutDashboard className='mr-2' />
              Back to Dashboard
            </Link>
          </div>
          <CardDescription>
            <p className='my-4'>You have taken a total of {quizCount} quizzes!</p>
            <Separator orientation='horizontal' />
          </CardDescription>
        </CardHeader>        
        <CardContent className={'max-h-[60vh] ' + (quizCount > 0 ? 'overflow-y-scroll' : '')}>
          <HistoryComponent limit={100} userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

export default HistoryPage