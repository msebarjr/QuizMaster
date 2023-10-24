'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { differenceInSeconds } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'

// Utils
import { cn, formatTimeDelta } from '@/lib/utils'

// Prisma
import { Question, Quiz } from '@prisma/client'
import { checkAnswerSchema } from '@/schemas/form/quiz'

// Icons
import { Timer, Loader2, ChevronRight, BarChart } from 'lucide-react'

// shadcn Components
import { Button, buttonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// Custom Components
import BlankAnswerInput from '@/components/BlankAnswerInput'

type Props = {
  quiz: Quiz & {questions: Pick<Question, 'id' | 'question' | 'answer'>[]}
}

const OpenEnded = ({quiz}: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [blankAnswer, setBlankAnswer] = useState<string>('')
  const [quizEnded, setQuizEnded] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  const {toast} = useToast()

  const currentQuestion = useMemo(() => {
    return quiz.questions[questionIndex]
  }, [questionIndex, quiz.questions])

  const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer
      document.querySelectorAll('#user-blank-input').forEach(input => {
        filledAnswer = filledAnswer.replace('_____', input.value)
        input.value = ''
      })
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer
      }
      const response = await axios.post('/api/checkAnswer', payload)

      return response.data
    }
  })

  const handleNext = useCallback(() => {
    if (isChecking) return 

    checkAnswer(undefined, {
      onSuccess: ({percentageSimilar}) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer.`,
          description: 'Answers are graded based on similarity comparisons.'
        })

        if (questionIndex === quiz.questions.length - 1) {
          setQuizEnded(true)
          return 
        }

        setQuestionIndex(prev => prev + 1)
      }
    })
  }, [checkAnswer, toast, isChecking, questionIndex, quiz.questions.length])

  // Creates the timer 
  useEffect(() => {
    const interval = setInterval(() => {
      if (!quizEnded) setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [quizEnded])

  // Allows for keyboard use to make selection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') handleNext()
    }  

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNext])

  if (quizEnded) {
    return (
      <div className='absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in {formatTimeDelta(differenceInSeconds(currentTime, quiz.timeStarted))}
        </div>
        <Link href={`/statistics/${quiz.id}`} className={cn(buttonVariants({size: 'lg'}), 'mt-2')}>
          View Statistics
          <BarChart className='w-4 h-4 ml-2' />
        </Link>
      </div>
    )
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
            {formatTimeDelta(differenceInSeconds(currentTime, quiz.timeStarted))}
          </div>
        </div>
        {/* <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/> */}
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
        <BlankAnswerInput answer={currentQuestion.answer} setBlankAnswer={setBlankAnswer}/>
        <Button className='mt-2' disabled={isChecking} onClick={handleNext}>
          {isChecking && <Loader2 className='w-4 h-4 mr-2 animated-spin' />}
          Next <ChevronRight className='w-4 h-4 ml-2' /></Button>
      </div>
    </div>
  )
}

export default OpenEnded