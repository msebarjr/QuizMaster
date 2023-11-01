import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'


type Props = {
  setError: React.Dispatch<React.SetStateAction<boolean>>
}

const QuizError = ({setError}: Props) => {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]'>
      <Card>
        <CardHeader>         
          <CardTitle className='text-2xl font-bold text-red-500 mb-4'>
            Error!
          </CardTitle>
          <Separator orientation='horizontal' className='mb-4'/>      
          <CardDescription className='leading-6'>
            There was an error in fetching your quiz from ChatGPT. This only proves that AI is not coming for my job anytime soon.
          </CardDescription> 
        </CardHeader>
        <CardContent>       
          <Link href='/quiz' onClick={() => setError(false)} className={cn(buttonVariants(), 'w-full')}>          
            Try Again!
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuizError