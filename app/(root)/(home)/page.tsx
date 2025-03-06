import React from 'react'
import Image from 'next/image'
import MeetingTypeList from '@/components/MeetingTypeList';
const Home = () => {
 const now = new Date();
 const time = now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
 const date = new Intl.DateTimeFormat('en-US',{dateStyle:'full'}).format(now);
  return (

    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-cover bg-center bg-[url("/images/hero-background.png")]'>
      {/* <Image src='/images/hero-background.png'
      alt='home-image-here'
      width={1000}
      height={50}/> */}
      <div className='flex h-full flex-col justify-between max-md:px-2 max-md:py-8 lg:p-7'>
      <h2 className='bg-white bg-opacity-10 text-center max-w-[270px] rounded py-2 px-1 max-sm:px-2 text-base font-normal'>
        Upcoming meeting at 12:30 PM
        </h2>
        <div className='flex flex-col gap-2'>
          <h1 className='text-4xl font-extrabold lg:text-6xl max-sm:px-2'>{time}</h1>
          <p className=' text-lg px-1 font-bold text-sky-1 lg:text-1xl max-sm:px-2'>{date}</p>
        </div>
      </div>
      </div>
      <MeetingTypeList/>
    </section>
  )
}

export default Home
