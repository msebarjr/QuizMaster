'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Icons
import { CopyCheck, BookOpen } from 'lucide-react'

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

type Props = {}

type Input = z.infer<typeof quizSchema>

const CreateQuizForm = (props: Props) => {
  const form = useForm<Input>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      amount: 3, 
      topic: '',
      type: 'mcq'
    }
  })

  const onSubmit = (input: Input) => {
    alert(JSON.stringify(input, null, 2))
  }

  const onInputChange = (e: any) => {
    form.setValue('amount', parseInt(e.target.value))
  }

  const onButtonChange = (type: 'mcq' | 'open_ended') => {
    form.setValue('type', type)
  }

  // Rerenders form when state changes
  form.watch()

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
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel># of Questions</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter an amount..." {...field} type='number' min={1} max={10} onChange={onInputChange}/>
                    </FormControl>
                    <FormDescription>
                      Between 1-10
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type='button' className='w-1/2 rounded-none rounded-l-lg' variant={form.getValues('type') === 'mcq' ? 'default' : 'secondary'} onClick={onButtonChange.bind(this, 'mcq')}>
                  <CopyCheck className='w-4 h-4 mr-2' />Multiple Choice
                </Button>
                <Separator orientation='vertical'/>
                <Button type='button' className='w-1/2 rounded-none rounded-r-lg' variant={form.getValues('type') === 'open_ended' ? 'default' : 'secondary'} onClick={onButtonChange.bind(this, 'open_ended')}>
                  <BookOpen className='w-4 h-4 mr-2' />Open Ended
                </Button>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateQuizForm