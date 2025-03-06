'use client'
import React, { use, useReducer, useState } from 'react'
import Image from 'next/image'
import HomeCard from './HomeCard'
import { useRouter}  from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/hooks/use-toast"
import { arrayBuffer } from 'stream/consumers'
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

import ReactDatePicker from 'react-datepicker'
function MeetingTypeList() {
  const { toast } = useToast()

    const router = useRouter();
    const [meetingState,setmeetingState] = useState<'isScheduleMeeting'| 'isJoiningMeeting' |
    'isInstantMeeting'|undefined>();

    const {user} = useUser();
    const client = useStreamVideoClient();

    const[values,setvalues] = useState({dateTime:new Date(),
      description:'',
      link:''
    })
    const baseUrl = "fyp-two-pi.vercel.app/";
    const [callDetails,setcallDetails] = useState<Call>()
    const createMeeting =async()=>{
            if(!user||!client)return;
            try{
               const id = crypto.randomUUID();
               const call = client.call('default',id);
               if(!call)throw new Error('Failed to create Call!!');

               const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
               const description = values.description||'Instant Meeting';
               if(!startsAt){
                toast({
                  description:"Meeting could not be scheduled",
                })
               }
      
               await call.getOrCreate({
                data:{
                  starts_at:startsAt,
                  custom:{
                    description
                  }
                }
               })

              setcallDetails(call);
              toast({
                description: "Meeting created successfully",
              })
              if(!values.description)router.push(`/meeting/${call.id}`);
            
      
            }catch(err){
              console.log(err);
              toast({
                description: "Meeting was not created",
              })
      
            }
    }
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
 
    <section className='grid grid-cols-1 gap-5  md:grid-cols-2 xl:grid-cols-4'>
       <HomeCard 
       img="/icons/add-meeting.svg" 
       title="New Meeting"
       description="Start your meet instantly"
       handleClick={()=>setmeetingState('isInstantMeeting')}
       className='bg-orange-1'
       />
       <HomeCard img="/icons/join-meeting.svg" 
       title="Join Meeting"
       description="Join via an invitation link"
       handleClick={()=>setmeetingState('isJoiningMeeting')}
       className='bg-blue-1'
       />
       <HomeCard
        img="/icons/schedule.svg" 
        title="Schedule Meeting"
        description="Schedule a Meet"
        handleClick={()=>setmeetingState('isScheduleMeeting')}
        className ='bg-purple-1'
        />
       <HomeCard
        img="/icons/recordings.svg" 
        title="Recordings"
        description="Check out your recordings"
        handleClick={()=>router.push('/recordings')}
        className='bg-yellow-1'
        />
      
      {!callDetails ?(
     <MeetingModel
     isOpen={meetingState === 'isScheduleMeeting'}
     onClose={() => setmeetingState(undefined)}
     title="Schedule a Meeting"
     className="text-center"
     buttonText="Schedule Meeting"
     handleClick={createMeeting}
   >
     <div className="flex flex-col gap-2.5">
       <label className="text-base text-normal leading-[22px] text-sky-2">
         Add a description
       </label>
       <Textarea
         className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
         onChange={(e) => setvalues({ ...values, description: e.target.value })}
       />
       <div className='flex w-full flex-col gap-2.5 '>
       <label className="text-base text-normal leading-[22px] text-sky-2">
         Select Date and Time
       </label>
       <ReactDatePicker
       selected={values.dateTime}
       onChange={(date)=>{setvalues({...values,
        dateTime: date!
       })}}
       showTimeSelect
       timeFormat='HH mm'
      timeIntervals={30}
       timeCaption='time'
       dateFormat="MMMM:d, yyyy h:mm aa"
       className='w-full rounded bg-dark-2 p-2 focus:outline-none'
       />
       </div>
     </div>    
   </MeetingModel>
      ):(
        <MeetingModel
       isOpen={meetingState==='isScheduleMeeting'}
       onClose={()=>{
        setmeetingState(undefined)
       }
       }
       title='Created Meeting'
       className='text-center'
       handleClick={()=>{
        navigator.clipboard.writeText(meetingLink);
        // toast({
        //   title: "Link Copied",
        // })
        toast({
          description:"Link Copied"
        })
       }}
       image='/icons/checked.svg'
       buttonIcon='/icons/copy.svg'
       buttonText="Copy Meeting Link"
       />
      )}

       <MeetingModel
       isOpen={meetingState==='isInstantMeeting'}
       onClose={()=>{
        setmeetingState(undefined)
       }
       }
       title='Start an Instant Meeting'
       className='text-center'
       buttonText = "Start Meeting"
       handleClick={createMeeting}
       />
         <MeetingModel
       isOpen={meetingState==='isJoiningMeeting'}
       onClose={()=>{
        setmeetingState(undefined)
       }
       }
       title='Paste meet link here'
       className='text-center'
       buttonText = "Join Meeting"

       handleClick={()=>{router.push(values.link.replace(baseUrl,""))}}
       >
       <Input className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0' placeholder="Paste meeting link here"
       onChange={(e)=>{
        setvalues({...values,link:e.target.value})
       }}/>
       </MeetingModel>
       
    </section>
  )
}

export default MeetingTypeList