"use client"
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function EndCallButton() {
    const router = useRouter();
    const call = useCall();
    const {useLocalParticipant} = useCallStateHooks();
    const localPartipant = useLocalParticipant();

    const isMeetingOwner = localPartipant && call?.state.createdBy
     && localPartipant.userId === call.state.createdBy.id;
     if(!isMeetingOwner)return null;
  return (
    <Button onClick={async()=>{
        await call.endCall();
        router.push('/');
    }} className='bg-red-500'>  
    End Your Call
    </Button>
  )
}

export default EndCallButton