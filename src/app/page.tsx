import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/nextauth';

// Custom Components
import { LoginButton } from '@/components/Buttons';

export default async function Home() {
  const session = await getAuthSession()

  // If user is signed it, redirects to Dashboard - Protected Route
  if (session?.user) return redirect('/dashboard')

  return (
    <div className="absolute top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2">
      <Card className='w-[300px]'>
        <CardHeader>
          <CardTitle>Welcome to QuizMaster!</CardTitle>
          <CardDescription>
            QuizMaster is an AI generated quiz app that allows you to create and share quizzes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton text='Login with Google' />
        </CardContent>
      </Card>
    </div>
  )
}
