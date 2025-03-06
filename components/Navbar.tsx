import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MobileNav from './MobileNav'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className='flex-between z-50 w-full bg-dark-1 px-6 py-4 max-lg:p-10'>
      <Link href='/' className='flex items-center gap-1'>
      <Image src="/icons/logo.svg"
      alt="logoImage"
      width={26}
      height={26}
      className='max-sm:size-10'/>
      <p className='p-2 text-[24px] font-extrabold text-white max-sm:hidden'>FYP</p>
      </Link>
      <div className='flex-between gap-5'>
        <SignedIn>
            <UserButton/>
        </SignedIn>
        {/* <SignedOut>
            <SignInButton/>
        </SignedOut> */}
        <MobileNav/>
      </div>
    </nav>
  )
}
