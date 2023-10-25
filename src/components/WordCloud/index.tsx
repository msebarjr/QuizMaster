'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import D3WordCloud from 'react-d3-cloud'
import { useRouter } from 'next/navigation'

type Props = {
  formattedTopics: { text: string, value: number }[]
}

const fontSizeMapper = (word: {value: number}) => {
  return Math.log2(word.value) * 5 + 16
}

const WordCloud = ({formattedTopics}: Props) => {
  const theme = useTheme()
  const router = useRouter()

  return (
    <>
      <D3WordCloud data={formattedTopics} height={550} font='Times' fontSize={fontSizeMapper} rotate={0} padding={10} onWordClick={(event, word) => {router.push(`/quiz?topic=${word.text}`)}} fill={theme.theme === 'dark' ? 'white' : 'black'} />    
    </>
  )
}

export default WordCloud