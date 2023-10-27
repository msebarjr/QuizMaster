import { Question } from '@prisma/client'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeDelta(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600 ) / 60) 
  const secs = Math.floor(seconds - hours * 3600 - minutes * 60)
  
  const time = []

  if (hours > 0) time.push(`${hours}h`)
  if (minutes > 0) time.push(`${minutes}m`)
  if (secs > 0) time.push(`${secs}s`)

  return time.join(' ')
}

export function getAccuracy(quizType: string, questions: Question[]) {
  let accuracy: number = 0

  if (quizType === 'mcq') {
    let totalCorrect = questions.reduce((acc, question) => {
      if (question.isCorrect) return acc + 1

      return acc
    }, 0)

    accuracy = (totalCorrect / questions.length) * 100
  } else if (quizType === 'open_ended') {
    let totalPercentage = questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect || 0)
    }, 0)

    accuracy = totalPercentage / questions.length 
  }

  accuracy = Math.round(accuracy * 100) / 100

  return accuracy
}