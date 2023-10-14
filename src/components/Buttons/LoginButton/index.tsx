// Next identifies components as server components which do not understand onClicks, hover, hooks, etc.. use client tells NextJS that this is a client component
'use client'

import React from 'react'
import { signIn } from 'next-auth/react'

// shadcn Components
import { Button } from '../../ui/button'

type Props = {
  text: string
}

const LoginButton = ({text}: Props) => {
  const handleLogin = () => {
    signIn('google').catch(console.error)
  }

  return (
    <Button onClick={handleLogin}>{text}</Button>
  )
}

export default LoginButton