import React from 'react'

// shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Custom Components
import WordCloud from '@/components/WordCloud'

type Props = {}

const HotTopicsCard = (props: Props) => {
  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
        <CardDescription>Click on a topic to start a quiz!</CardDescription>
      </CardHeader>
      <CardContent className='pl-2'><WordCloud /></CardContent>
    </Card>
  )
}

export default HotTopicsCard