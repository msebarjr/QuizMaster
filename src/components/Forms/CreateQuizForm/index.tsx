'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

// Icons
import { CopyCheck } from 'lucide-react'

// Schemas
import { quizSchema } from '@/schemas/form/quiz'

// shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from '@/components/ui/separator'

// Custom Components
import Loading from '@/components/Loading'
import QuizError from '@/components/QuizError'

type Props = {
  topicParam: string
}

type Input = z.infer<typeof quizSchema>

const CreateQuizForm = ({topicParam}: Props) => {
  const router = useRouter()

  const [error, setError] = useState<boolean>(false)
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)

  const {mutate: getQuestions, isLoading} = useMutation({
    mutationFn: async ({amount, topic, type}: Input) => {
      const response = await axios.post('/api/quiz', {
        amount,
        topic,
        type,
      })
      return response.data
    }
  })
  
  const form = useForm<Input>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      amount: 1, 
      topic: topicParam,
      type: 'mcq'
    }
  })

  const onSubmit = (input: Input) => {
    setShowLoader(true)
    getQuestions({
      amount: input.amount,
      topic: input.topic,
      type: input.type
    }, {
      onSuccess: ({quizId}) => {
        setFinished(true)

        setTimeout(() => {         
            router.push(`/play/mcq/${quizId}`)          
        }, 1000)
      },
      onError: () => {
        setShowLoader(false)
        setError(true)
      }
    })
  }

  const onButtonChange = (amount: 1 | 3 | 5) => {
    form.setValue('amount', amount)
  }

  // Rerenders form when state changes
  form.watch()

  if (showLoader) return <Loading finished={finished}/>
  if (error) return <QuizError />

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]">
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Create Quiz</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide a topic
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <div>
                  <p># of Questions</p>
                </div>
                <div className='flex'>
                  <Button type='button' className='w-1/2 rounded-none rounded-l-lg' variant={form.getValues('amount') === 1 ? 'default' : 'secondary'} onClick={onButtonChange.bind(this, 1)}>
                    <CopyCheck className='w-4 h-4 mr-2' />1
                  </Button>
                  <Separator orientation='vertical'/>
                  <Button type='button' className='w-1/2 rounded-none rounded-r-lg' variant={form.getValues('amount') === 3 ? 'default' : 'secondary'} onClick={onButtonChange.bind(this, 3)}>
                    <CopyCheck className='w-4 h-4 mr-2' />3
                  </Button>
                  <Separator orientation='vertical'/>
                  <Button type='button' className='w-1/2 rounded-none rounded-r-lg' variant={form.getValues('amount') === 5 ? 'default' : 'secondary'} onClick={onButtonChange.bind(this, 5)}>
                    <CopyCheck className='w-4 h-4 mr-2' />5
                  </Button>
                </div>
              </div>
              <Button className='w-full uppercase' disabled={isLoading} type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateQuizForm