import React from 'react'
import { differenceInSeconds } from 'date-fns'

// shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Icons
import { Hourglass } from 'lucide-react'

// Utils
import { formatTimeDelta } from '@/lib/utils'

type Props = {
  timeStarted: Date,
  timeEnded: Date,
  accuracy: number
}

const TimeTakenCard = ({timeEnded, timeStarted, accuracy}: Props) => {
  return (
    <Card className='md:col-span-4'>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-2xl font-bold'>Time Taken</CardTitle>
        <Hourglass />
      </CardHeader>
      <CardContent>
        <div className='text-sm font-medium'>
          {!isNaN(accuracy) ? formatTimeDelta(differenceInSeconds(timeEnded, timeStarted)) : <p className='text-red-500'>No Data!</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export default TimeTakenCard