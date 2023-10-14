'use client'

import React from 'react'
import { signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'

// shadcn Components
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Custom Components
import UserAvatar from '../UserAvatar'

// Icons
import { LogOut } from 'lucide-react'

type Props = {
  // user is comes from session.user and session comes from next-auth
  // TS allows to 'Pick' certain attributes
  user: Pick<User, "name" | "image" | "email">
}

const UserAccount = ({user}: Props) => {
  const handleSignOut = (e: any) => {
    e.preventDefault()
    signOut().catch(console.error)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/*  User Avatar */}
        <UserAvatar user={user}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className='font-medium'>{user.name}</p>}
            {user.email && <p className='w-[200px] truncate text-sm text-zinc-700'>{user.email}</p>}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/'>Meow</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className='text-red-600 cursor-pointer'>
          Sign Out
          <LogOut className='w-4 h-4 ml-2' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccount