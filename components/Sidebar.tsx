'use client'

import { sideLinks } from '@/constants'
import { cn } from '@/lib/utils';
import { link } from 'fs'
import Link  from 'next/link';
import { usePathname } from 'next/navigation'
import path from 'path';
import React from 'react'
import Image from 'next/image';

function Sidebar() {
    const pathname = usePathname();
  return (
    <section className='sticky left-0 top-0 flex h-screen w-full flex-col justify-between 
    bg-dark-1 p-6 pt-8 text-white max-sm:hidden lg:w-[264px] ' >
        < div className='flex flex-1 flex-col gap-6'>
          {sideLinks.map((link)=>{
            const isActive = pathname === link.route||pathname.startsWith(`${link.route}/`);
            return (
                <Link href = {link.route}
                key = {link.label}
                className ={cn('flex gap-4 items-center p-4 rounded-lg justify-start',{
                    'bg-blue-1':isActive,
                })}>
                  <Image src={link.imgURL}
                  alt={link.label} width={24}
                  height={24} />
                  <p className='text-lg font-semibold max-lg:hidden'>{link.label}</p>
                </Link>
            )
          })}
        </div>
       
    </section>
  )
}

export default Sidebar