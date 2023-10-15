// /api/quiz

import { getAuthSession } from '@/lib/nextauth'
import { NextResponse } from 'next/server'
import axios from 'axios';

// Schema
import { quizSchema } from '@/schemas/form/quiz'
import { ZodError } from 'zod'
import { prisma } from '@/lib/db'

type mcqQuestion = {
  question: string,
  answer: string,
  option1: string,
  option2: string,
  option3: string
}

type openQuestion = {
  question: string,
  answer: string
}

export const POST = async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({
        error: 'You must be logged in!'
      }, {
        status: 401
      })
    }

    const body = await req.json()
    const { amount, topic, type } = quizSchema.parse(body)
    
    const quiz = await prisma.quiz.create({
      data: {
        quizType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,     
      }
    })

    const {data} = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type
    })

    if (type === 'mcq') {
      let quizData = data.questions.map((question: mcqQuestion) => {
        let options = [question.answer, question.option1, question.option2, question.option3]
        options = options.sort(() => Math.random() - 0.5)

        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          quizId: quiz.id,
          questionType: 'mcq'
        }
      })

      await prisma.question.createMany({
        data: quizData
      })
    } else if (type === 'open_ended') {
      let quizData = data.questions.map((question: mcqQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          quizId: quiz.id,
          questionType: 'open_ended'
        }
      })

      await prisma.question.createMany({
        data: quizData
      })
    }

    return NextResponse.json({
      quizId: quiz.id
    })

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({error: error.issues}, {status: 400})
    }

    return NextResponse.json({
      error: 'Something went wrong!'
    }, { status: 500})
  }
}