'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// shadcn Components
import { Progress } from '../ui/progress'

// Custom Components
import QuizError from '../QuizError'

type Props = {
  finished: boolean
}

const loadingTexts = [
  'Generating questions...',
  'Unleashing the power of curiousity...',
  'Diving deep into the depths of ChatGPT...',
  'Harnessing ChatGPT\'s knowledge of your topic...',
  'Igniting the passion of wonder and exploration...' 
]

const Loading = ({finished}: Props) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState(loadingTexts[0])
  const [counter, setCounter] = useState(0)
  

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length)
      setLoadingText(loadingTexts[randomIndex])
      setCounter(prev => prev + 4)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      let percentIncrease = Math.random() < 0.1 ? 2 : 1
      
      setProgress(prev => {
        if (finished) return 100
        if (prev === 100) return 0;
        return prev + percentIncrease
      })
    }, 200)

    return () => clearInterval(interval)
  }, [finished])

  if (counter >= 30) return <QuizError />

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center'>
      <Image src={'/loading.gif'} width={400} height={400} alt='loading animation'/>
      <Progress value={progress} className='w-full mt-4'/>
      <h1 className='mt-2 text-xl'>{loadingText}</h1>
    </div>
  )
}

export default Loading