import React from 'react'

// shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Icons
import { Award, Trophy } from 'lucide-react'

type Props = {
  accuracy: number
}

const ResultsCard = ({accuracy}: Props) => {
  return (
    <Card className='md:col-span-8'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
        <CardTitle className='text-2xl font-bold'>Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className='flex flex-col items-center justify-center h-3/5'>
        {!isNaN(accuracy) ? accuracy >= 75 ? (
          <>
            <Trophy className='mr-4' stroke='gold' size={50}/>
            <div className='flex flex-col text-2xl font-semibold text-yellow-400'>
              <span>Impressive!</span>
              <span className='text-sm text-black text-center opacity-50'>{'>= 75% accuracy'}</span>
            </div>
          </>
        ) : accuracy >= 50 ? (
          <>
            <Trophy className='mr-4' stroke='silver' size={50}/>
            <div className='flex flex-col text-2xl font-semibold text-yellow-400'>
              <span>Good Job!</span>
              <span className='text-sm text-black text-center opacity-50'>{'>= 50% accuracy'}</span>
            </div>
          </>
        ) : (
          <>
            <Trophy className='mr-4' stroke='silver' size={50}/>
            <div className='flex flex-col text-2xl font-semibold text-yellow-400'>
              <span>You can do better!</span>
              <span className='text-sm text-black text-center opacity-50'>{'< 50% accuracy'}</span>
            </div>
          </>
        ) : <p className='mb-4 text-red-500'>ChatGPT produced an error for this quiz!</p>}
      </CardContent>
    </Card>
  )
}

export default ResultsCard