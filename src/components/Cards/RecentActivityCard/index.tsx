import React from 'react'
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/nextauth'

// shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Custom Components
import HistoryComponent from '@/components/History'

// Prisma
import { prisma } from '@/lib/db'

type Props = {}

const RecentActivityCard = async (props: Props) => {
  const session = await getAuthSession()

  if (!session?.user) return redirect('/')

  const quizCount = await prisma.quiz.count({
    where: { userId: session.user.id }
  })

  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Recent Activity</CardTitle>
        <CardDescription className='flex flex-col gap-2'>
          <p>You have taken a total of {quizCount} quizzes!</p>
          <p>Here are your 10 most recent quizzes!</p>
          <Separator orientation='horizontal' className='mt-2'/>
        </CardDescription>
      </CardHeader>      
      <CardContent className={'max-h-[500px] ' + (quizCount > 0 ? 'overflow-y-scroll' : '')}>
        <HistoryComponent limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  )
}

export default RecentActivityCard