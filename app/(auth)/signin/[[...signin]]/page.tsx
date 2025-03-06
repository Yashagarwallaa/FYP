import { SignIn } from '@clerk/nextjs'
import React from 'react'

function SigninPage() {
  return (
    <div className='flex-center w-full mt-12'>
        <SignIn/>
    </div>
  )
}

export default SigninPage