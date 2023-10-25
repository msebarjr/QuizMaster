// /api/quiz
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import axios from 'axios';
import { getAuthSession } from '@/lib/nextauth';

// Schema
import { quizSchema } from '@/schemas/form/quiz'
import { z } from 'zod'

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
        error: 'You must be logged in to create a quiz!'
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

    await prisma.topicCount.upsert({
      where: { topic },
      create: {
        topic,
        count: 1
      },
      update: {
        count: {
          increment: 1
        }
      }
    })

    let config = {
      headers: {
        Authorization: process.env.OPENAI_API_KEY
      }
    }

    const {data} = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type
    }, config)

    if (type === 'mcq') {
      let quizData = data.questions.map((question: mcqQuestion) => {
        const options = [question.answer, question.option1, question.option2, question.option3].sort(() => Math.random() - 0.5)

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
      let quizData = data.questions.map((question: openQuestion) => {
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

    return NextResponse.json({quizId: quiz.id}, {status: 200})

  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({error: error.issues}, {status: 400})
    else return NextResponse.json({error: 'Something went wrong!'}, { status: 500 })}
}