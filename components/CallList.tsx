//@ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import useGetCalls from '@/hooks/useGetCalls';
import { useRouter } from 'next/navigation';
import { Call, CallRecording, CallRecordingList } from '@stream-io/video-react-sdk';
import MeetingCard from './MeetingCard';
import Loader from './Loader';
function CallList({type}:{type:'ended' | 'upcoming'|'recordings'}) {

    const {endedCalls,upComingCalls,callRecordings, isLoading} = useGetCalls();
    const router = useRouter();
    const [recordings,setRecordings] = useState<CallRecording[]>([])
     
    const getCalls = ()=>{
        switch(type){
        case 'ended':
            return endedCalls
        case 'upcoming':
            return upComingCalls
        case 'recordings':
            return recordings
        default:
            return []
        }
            
    }
    const getNoCallsMessage = ()=>{
        switch(type){
        case 'ended':
            return 'No previous meetings'
        case 'upcoming':
            return 'No upcoming meetings'
        case 'recordings':
            return 'No recorded calls'
        default:
            return ''
        }
            
    }
const calls = getCalls();
const noCallMessage = getNoCallsMessage();

useEffect(()=>{
     const getRecordings = async()=>{
        const callData= await Promise.all(callRecordings.map((meeting)=>meeting.queryRecordings()));
        const recordings = callData.filter((call)=>call.recordings.length>0).
        flatMap((call)=>call.recordings);
        setRecordings(recordings);
     }
     if (type === 'recordings') {
        getRecordings();
      }
},[type,callRecordings])

if(isLoading)return <Loader/>

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        { calls && calls.length>0 ? calls.map((meeting:Call|CallRecording)=>(
                <MeetingCard 
                key = {(meeting as Call).id}
                icon={
                    type === 'ended' ? '/icons/previous.svg' :
                    type === 'upcoming' ? '/icons/upcoming.svg'
                    : '/icons/recordings.svg'
                }
                title={(meeting as Call).state?.custom.description.substring(0,20)|| 'No description'}
                date = {meeting.state?.startsAt.toLocaleString() || 
               meeting.state?.starts_time.toLocaleString()}
               isPreviousMeeting = {type === 'ended'}
             buttonIcon1 = {type==='recordings' ? '/icons/play.svg' : undefined}
                buttonText = {type=== 'recordings' ? 'Play' : 'Start'}
                handleClick = {type==='recordings' ? ()=>(router.push(`${meeting.url}`)):()=>
                    (router.push(`/meeting/${meeting.id}`))}
                link = {type==='recordings' ? meeting.url : `${
                    process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                />
         )):(
               <h1>{noCallMessage}</h1>
         )}
    </div>
  )
}

export default CallList