import React, { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
 import Image from 'next/image' ;
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
interface MeetingModelProps{
    isOpen:boolean,
    onClose:()=>void,
    title:string,
    className?:string,
    children? : ReactNode,
    handleClick?:()=>void,
    buttonText?:string,
    image?:string,
    buttonIcon?:string
}

function MeetingModel({isOpen,onClose,title,className,children,handleClick,buttonText,
    image,buttonIcon
}:MeetingModelProps) {
  return (
    <div>
        <Dialog open={isOpen} onOpenChange={onClose} >
    <DialogContent className='flex w-full flex-col bg-dark-1 px-6 py-9 text-white
    max-w-[520px] gap-6 border-none'>
    <div className='flex flex-col gap-6'>
        {image && (
            <div className='flex justify-center'><Image src={image}
            alt="image"
            width={72}
            height={72}/>
             </div>
        )}
        <h1 className={cn('text-3xl font-bold leading-[42px]',className)}>{title}</h1>
        {children}
        <Button className='font-semibold bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0
        ' onClick={handleClick}>
            {buttonIcon && (
                <Image src={buttonIcon}
                alt='button-icon'
                width={12}
                height={12}
                />
            )}&nbsp;
            {buttonText||'Schedule Meeting'}
        </Button>
    </div>
    </DialogContent>
  </Dialog>
  </div>
  )
}

export default MeetingModel