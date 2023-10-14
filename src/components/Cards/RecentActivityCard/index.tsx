import React from 'react'

// shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {}

const RecentActivityCard = (props: Props) => {
  return (
    <Card className='col-span-4 lg:col-span-3'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Recent Activity</CardTitle>
        <CardDescription>You have taken a total of 7 quizzes!</CardDescription>
      </CardHeader>
      <CardContent className='max-h-[580px] overflow-y-scroll'>History</CardContent>
    </Card>
  )
}

export default RecentActivityCard