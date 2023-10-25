import React from 'react'

// shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Prisma
import { prisma } from '@/lib/db'

// Custom Components
import WordCloud from '@/components/WordCloud'

type Props = {}

const HotTopicsCard = async (props: Props) => {
  const topics = await prisma.topicCount.findMany({})
  const formattedTopics = topics.map(topic => {
    return {
      text: topic.topic,
      value: topic.count
    }
  })

  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
        <CardDescription>Click on a topic to start a quiz!</CardDescription>
      </CardHeader>
      <CardContent className='pl-2'>
        <WordCloud formattedTopics={formattedTopics}/>
      </CardContent>
    </Card>
  )
}

export default HotTopicsCard