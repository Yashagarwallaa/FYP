import { cn } from '@/lib/utils';
import { CallControls, useCall, CallingState, CallParticipantsList, CallStats, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';
  

type CallLayoutType = 'grid'|'speaker-left'|'speaker-right';
function MeetingRoom() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const[layout,setlayout] = useState<CallLayoutType>('speaker-left');
    const[showParticipants,setshowParticipants] =useState(false);
    const isPersonalRoom = !!!searchParams.get('personal');
    const {useCallCallingState} = useCallStateHooks();
    const callingState = useCallCallingState();
    if(callingState !==CallingState.JOINED)return <Loader/>
    const CallLayout = ()=>{
        switch(layout){
            case 'grid':
                return <PaginatedGridLayout/>
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition={'left'}/>
            default:
                return <SpeakerLayout participantsBarPosition={'right'}/>
        }
    }
  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
        <div className='relative size-full flex items-center justify-center'>
            <div className='flex items-center size-full max-w-[1000px]'>
                <CallLayout/>
            </div>
           {showParticipants && <div className={cn(' border-white h-[calc(100vh-86px)] ml-2')}>
               <CallParticipantsList  onClose={()=>{setshowParticipants(false)}}/>
            </div>}
        </div>
        <div className='flex-wrap fixed bottom-0 flex w-full items-center justify-center gap-5'>
           <CallControls onLeave={()=>{router.push('/')}}/>
           <DropdownMenu>
 <div className='flex items-center'>

  <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
    <LayoutList size={20} className='text-white '/>
  </DropdownMenuTrigger>
  </div>
  <DropdownMenuContent className='border-dark-1 text-white bg-dark-1'>
  {['Grid','Speaker-Left','Speaker-Right'].map((item,index)=>(

         <div key={index}>
            <DropdownMenuItem className='cursor-pointer'
             onClick={()=>{
                setlayout(item.toLocaleLowerCase() as
                CallLayoutType)
             }}>
            {item}
            </DropdownMenuItem>
                 </div>
            
  ))}
    <DropdownMenuSeparator />
   
  </DropdownMenuContent>
</DropdownMenu>
<CallStatsButton  />
<button onClick={() => setshowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {isPersonalRoom && <EndCallButton/>}
        </div>
    </section>
  )
}

export default MeetingRoom