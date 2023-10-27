import React from 'react'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'

// Custom Components
import { QuizMeCard, HistoryCard, HotTopicsCard, RecentActivityCard } from '@/components/Cards'

type Props = {}

export const metadata = {
  title: 'QuizMaster | Dashboard',
  description: 'AI Powered Quizzes',
}

const Dashboard = async (props: Props) => {
  const session = await getAuthSession()

  if (!session?.user) return redirect('/')

  return (
    <main className='p-8 mx-auto max-w-7xl'>
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-8">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  )
}

export default Dashboard