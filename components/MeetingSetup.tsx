
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

function MeetingSetup({setisSetUpComplete}:{setisSetUpComplete:(value:boolean)=>void}) {
    const[isMicCamToggledOn,setisMicCamToggledOn] = useState(false);
    const call = useCall();
    if(!call)throw new Error('Call not set up!');
    useEffect(()=>{
        if(isMicCamToggledOn){
            call?.camera.disable();
            call?.microphone.disable();
        }
        else {
            call?.camera.enable();
            call?.microphone.enable();
        }
    },[isMicCamToggledOn,call?.camera,call?.microphone])
  return (
    <div className='h-screen flex w-full flex-col gap-3 justify-center items-center text-white'>
        <h1 className='text-2xl font-bold'>Setup</h1>
        <VideoPreview/>
        <div className='flex h-16 items-center justify-center gap-3'>
            <label className='flex items-center justify-center font-mediu' >
                <input
                 type='checkbox' checked={isMicCamToggledOn}
                onChange={(e)=>setisMicCamToggledOn(e.target.checked)}>
                </input>
                    Join with mic and camera off
            </label>
            <DeviceSettings/>
        </div>
        <Button className='bg-green-500 rounded-md px-4 py-2.5' onClick={()=>{
            call.join();
            setisSetUpComplete(true);
        }}>Join Meeting</Button>
    </div>
  )
}

export default MeetingSetup