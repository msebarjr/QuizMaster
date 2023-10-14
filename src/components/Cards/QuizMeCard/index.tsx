'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

// Icons
import { BrainCircuit } from 'lucide-react'

// shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {}

const QuizMeCard = (props: Props) => {
  const router = useRouter()

  const handleQuiz = () => {
    router.push('/quiz')
  }

  return (
    <Card className='hover:cursor-pointer hover:opacity-75' onClick={handleQuiz}>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-2xl font-bold'>Quiz Me!</CardTitle>
        <BrainCircuit size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Challenge yourself with a quiz!</p>
      </CardContent>
    </Card>
  )
}

export default QuizMeCard