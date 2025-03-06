'use client'
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
  } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
//   const userId = "user-id";
//   const token = process.env.STREAM_API_KEY;
//   const user: User = { id: userId };
  
  
export const StreamVideoProvider = ({children}:{children :ReactNode}) => {
    const {user,isLoaded} =  useUser()
    console.log(user);
    const [videoClient,setvideoClient] = useState<StreamVideoClient>()    
    useEffect(()=>{
          if(!user)return;
          if(!isLoaded)return;
          if(!apiKey)throw new Error('Missing STREAM API KEY');
          const us:User={id:user.id};
          const client = new StreamVideoClient({
            apiKey,
            user:{
                id:user?.id,
                name:user?.username||user?.id,
                image:user?.imageUrl
            },
            tokenProvider,
        });
        setvideoClient(client);
    },[user,isLoaded])

    if(!videoClient)return (
        <Loader/>
    )

    return (
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    );
  };