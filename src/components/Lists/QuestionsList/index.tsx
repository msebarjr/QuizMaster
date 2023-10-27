import React from 'react'

// Utils
import { cn } from '@/lib/utils'

// Prisma
import { Question } from '@prisma/client'

// shadcn Components
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Props = {
  questions: Question[]
}

const QuestionsList = ({questions}: Props) => {
  let quizType = questions[0]?.questionType

  return (
    <Table className='mt-4'>
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[10px]'>No.</TableHead>
          <TableHead>Quesion & Correct Answer</TableHead>
          <TableHead>Your Answer</TableHead>

          {quizType === 'open_ended' && (
            <TableHead className='w-[10px] text-right'>Accuracy</TableHead>
          )}

        </TableRow>
      </TableHeader>
      <TableBody>
        <>
            {questions.map((question, index) => {
              return (
                <TableRow key={question.id}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>{question.question}<br /><br /><span className='font-semibold'>{question.answer}</span></TableCell>
                  {quizType === 'mcq' && (
                    <TableCell className={cn({
                      'text-green-600': question.isCorrect,
                      'text-red-600': !question.isCorrect
                    })}>
                      {question.userAnswer}
                    </TableCell>
                  )}
                  {quizType === 'open_ended' && (
                    <>
                      <TableCell>{question.userAnswer}</TableCell>
                      <TableCell className='text-right'>{question.percentageCorrect}%</TableCell>
                    </>
                  )}
                </TableRow>
            )})}
        </>
      </TableBody>
    </Table>
  )
}

export default QuestionsList