'use client'

import React, { useMemo, useState } from 'react'
import { Question, Quiz } from '@prisma/client'

// Icons
import { ChevronRight, Timer } from 'lucide-react'

// Custom Components
import { MCQCounter } from '@/components/Counters'

// shadcn Components
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  quiz: Quiz & {questions: Pick<Question, 'id' | 'options' | 'question'>[]}
}

const MCQ = ({quiz}: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState(0)

  const currentQuestion = useMemo(() => {
    return quiz.questions[questionIndex]
  }, [questionIndex, quiz.questions])

  const options = useMemo(() => {
    if (!currentQuestion) return []
    if (!currentQuestion.options) return []
    return JSON.parse(currentQuestion.options as string) as string[]
  }, [currentQuestion])

  const handleSelectedOption = (index: number) => {
    setSelectedChoice(index)
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* Topic */}
          <p>
            <span className="text-slate-400 mr-2">Topic</span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">{quiz.topic}</span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className='mr-2'/>
            <span>00:00</span>
          </div>
        </div>
        <MCQCounter correctAnswers={3} wrongAnswers={4}/>
      </div>

      <Card className='w-full mt-4'>
        <CardHeader className='flex flex-row items-center'>
          <CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {quiz.questions.length}
            </div>
          </CardTitle>
          <CardDescription className='flex-grow text-lg'>
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => {
          return (
            <Button key={index} variant={selectedChoice === index ? 'default' : 'secondary'} onClick={handleSelectedOption.bind(this, index)} className='justify-start w-full py-8 mb-4'>
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          )
        })}
        <Button className='mt-2'>Next <ChevronRight className='w-4 h-4 ml-2' /></Button>
      </div>
    </div>
  )
}

export default MCQ