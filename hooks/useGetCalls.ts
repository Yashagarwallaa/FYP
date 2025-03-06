import React, { useState,useEffect } from 'react'
import { Call,useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs';
function useGetCalls() {
    const [calls,setCalls] = useState<Call[]>([])
    const client = useStreamVideoClient();
    const [isLoading,setLoading] = useState(false);
    const {user} = useUser();

    useEffect(()=>{
          const loadCalls = async()=>{
           if(!client || !user?.id)return;
           setLoading(true);
           try{
            const {calls} = await client.queryCalls({
                sort:[{field:"starts_at", direction:-1}], //since timestap of later time is larger(decreasing)
                filter_conditions:{
                    starts_at:{$exists:true}, //must condition
                    //either one of these 2 condition is there
                    $or:[{
                        created_by_user_id:user?.id
                    },
                    {
                        members:{$in:[user.id]}
                    }
                ]
                }
            });
            setCalls(calls);


           }catch(err){
                 console.log(err);
           }finally{
         setLoading(false);
           }
          }
          loadCalls();
    },[client,user?.id])

    const now = new Date();

    const endedCalls = calls.filter(({state:{startsAt, endedAt}}:Call)=>{
        return (startsAt && new Date(startsAt) < now || !!endedAt )
    })
    const upComingCalls = calls.filter(({state:{startsAt}}:Call)=>{
        return (startsAt && new Date(startsAt) > now);
    })

    return {
        endedCalls,
        upComingCalls,
        callRecordings:calls,
        isLoading
    }
}

export default useGetCalls