'use client'

import React from 'react'

// Icons
import { History } from 'lucide-react'

// shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

type Props = {}

const HistoryCard = (props: Props) => {
  const router = useRouter()

  const handleHistory = () => {
    router.push('/history')
  }

  return (
    <Card className='hover:cursor-pointer hover:opacity-75' onClick={handleHistory}>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-2xl font-bold'>History</CardTitle>
        <History size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>View past quizzes</p>
      </CardContent>
    </Card>
  )
}

export default HistoryCard