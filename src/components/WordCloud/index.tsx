'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import D3WordCloud from 'react-d3-cloud'

type Props = {}

const data = [
  {
    text: 'Hey',
    value: 3,
  },
  {
    text: 'Hello',
    value: 5,
  },
  {
    text: 'Computer',
    value: 10,
  },
  {
    text: 'NextJS',
    value: 8,
  },
  {
    text: 'Live',
    value: 7,
  },
]

const fontSizeMapper = (word: {value: number}) => {
  return Math.log2(word.value) * 5 + 16
}

const WordCloud = (props: Props) => {
  const theme = useTheme()
  return (
    <>
      <D3WordCloud data={data} height={550} font='Times' fontSize={fontSizeMapper} rotate={0} padding={10} fill={theme.theme === 'dark' ? 'white' : 'black'} />
    </>
  )
}

export default WordCloud