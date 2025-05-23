'use server'

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const secretKey = process.env.STREAM_SECRET_KEY;

export const tokenProvider=async()=>{
    const user = await currentUser();

    if(!user)throw new Error('User not logged in!!');
    if(!apiKey||!secretKey)throw new Error('Problem in Stream API');

    const client = new StreamClient(apiKey,secretKey);
    const vailidity = 60 * 60;
    // const issued = Math.floor(Date.now()/1000)-60; //doubt
     
    const token = client.generateUserToken({user_id:user.id,validity_in_seconds:
    vailidity});
    return token;
}