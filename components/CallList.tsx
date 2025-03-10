//@ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import useGetCalls from '@/hooks/useGetCalls';
import { useRouter } from 'next/navigation';
import { Call, CallRecording, CallRecordingList } from '@stream-io/video-react-sdk';
import MeetingCard from './MeetingCard';
import * as path from 'path';
// import downloadAndExtractAudio from '../components/downloadAudio.js'
import {useDownloadMP3,getTranscript, getSummary} from '../components/TrancribeFunction';
import Loader from './Loader';
import trancribeAudio from './TrancribeFunction';
import getPDF from './downloadPdf';
function CallList({type}:{type:'ended' | 'upcoming'|'recordings'}) {

    const {endedCalls,upComingCalls,callRecordings, isLoading} = useGetCalls();
    const router = useRouter();
    const [recordings,setRecordings] = useState<CallRecording[]>([])
    const [transcripts,setTranscripts] = useState("");
     
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
const handleGetTranscript = async(meeting: CallRecording) => {
    // const { downloadMP3 } = useDownloadMP3();
    // await downloadMP3({ url: meeting.url });
    try {
        const response = await fetch(`/api/getAudio?url=${encodeURIComponent(meeting.url)}`);
        const data = await response.json();
          
        if (data.success) {
            console.log('File saved at:', data.filePath);
        } else {
            console.log('Download failed:', data.error);
        }
        const transcript = await getTranscript(data.filePath);
    if (transcript) {
        console.log('Transcript:', transcript);
        getPDF(transcript,'meeting_transcript', 'Meeting Transcript');
        setTranscripts(transcript);

    }

    } catch (error) {
        console.log('Error:', error);
    }
  
};

const handleGetSummary = async(meeting: CallRecording) => {
        if(transcripts!==""){
            const summary = await getSummary(transcripts);
            getPDF(summary,'meeting_summary', 'Meeting Summary');

        }
        else {
            const response = await fetch(`/api/getAudio?url=${encodeURIComponent(meeting.url)}`);
            const data = await response.json();
              
            if (data.success) {
                console.log('File saved at:', data.filePath);
            } else {
                console.log('Download failed:', data.error);
            }
            const transcript = await getTranscript(data.filePath);
                console.log('Transcript:', transcript);
                const summary = await getSummary(transcript);
                getPDF(summary,'meeting_summary', 'Meeting Summary');
            
        }
};
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
                    showTranscriptButton={type === 'recordings'}
                    showSummaryButton={type === 'recordings'}
                    transcriptButtonText="Get Transcript"
                    summaryButtonText="Get Summary"
                    handleTranscriptClick={() => handleGetTranscript(meeting)}
                    handleSummaryClick={() => handleGetSummary(meeting)}
                />
         )):(
               <h1>{noCallMessage}</h1>
         )}
    </div>
  )
}

export default CallList