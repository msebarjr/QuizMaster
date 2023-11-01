'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'
import { differenceInSeconds } from 'date-fns'
import { cn, formatTimeDelta } from '@/lib/utils'

// Prisma
import { Question, Quiz } from '@prisma/client'
import { checkAnswerSchema } from '@/schemas/form/quiz'

// Icons
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react'

// Custom Components
import { MCQCounter } from '@/components/Counters'
import QuizError from '@/components/QuizError'

// shadcn Components
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

type Props = {
  quiz: Quiz & {questions: Pick<Question, 'id' | 'options' | 'question'>[]}
}

const MCQ = ({quiz}: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [selectedChoice, setSelectedChoice] = useState<number>(0)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [wrongAnswers, setWrongAnswers] = useState<number>(0)
  const [quizEnded, setQuizEnded] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  const {toast} = useToast()
  
  const currentQuestion = useMemo(() => {
    return quiz.questions[questionIndex]
  }, [questionIndex, quiz.questions])

  

  const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice]
      }
      const response = await axios.post('/api/checkAnswer', payload)
      return response.data
    }
  })

  const handleNext = useCallback(() => {
    if (isChecking) return 

    checkAnswer(undefined, {
      onSuccess: ({isCorrect}) => {
        if (isCorrect) {
          toast({
            title: 'Correct!',
            description: 'Correct Answer',
            variant: 'success'
          })
          setCorrectAnswers(prev => prev + 1)
        } else {
          toast({
            title: 'Incorrect!',
            description: 'Incorrect Answer',
            variant: 'destructive'
          })
          setWrongAnswers(prev => prev + 1)      
        }

        if (questionIndex === quiz.questions.length - 1) {
          setQuizEnded(true)
          return 
        }

        setQuestionIndex(prev => prev + 1)
        setSelectedChoice(0)
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
      if (event.key === '1') setSelectedChoice(0)
      else if (event.key === '2') setSelectedChoice(1)
      else if (event.key === '3') setSelectedChoice(2)
      else if (event.key === '4') setSelectedChoice(3)
      else if (event.key === 'Enter') handleNext()
    }  

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNext]) 

  const options = useMemo(() => {
    if (!currentQuestion) return []
    if (!currentQuestion.options) return []
    return JSON.parse(currentQuestion?.options as string) as string[]
  }, [currentQuestion])

  if (!currentQuestion) return <QuizError setError={true}/>

  const handleSelectedOption = (index: number) => {
    setSelectedChoice(index)
  }

  if (quizEnded) {
    return (
      <div className='absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in {formatTimeDelta(differenceInSeconds(currentTime, quiz.timeStarted))}
        </div>
        <Link href={`/statistics/${quiz.id}`} className={cn(buttonVariants(), 'mt-2')}>View Statistics <BarChart className='w-4 h-4 ml-2' /></Link>
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
        <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/>
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
            {currentQuestion?.question}
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
        <Button className='mt-2' disabled={isChecking} onClick={handleNext}>
          {isChecking && <Loader2 className='w-4 h-4 mr-2 animated-spin' />}
          Next <ChevronRight className='w-4 h-4 ml-2' /></Button>
      </div>
    </div>
  )
}

export default MCQ