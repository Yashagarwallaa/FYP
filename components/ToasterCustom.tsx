'use client'
import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from 'next/navigation';

const ToasterCustom = () => {
 
  const pathname = usePathname();
 const isToaster = pathname !=='/';
  return (
    <>
    {isToaster && <Toaster/>}
    </>
  )
}

export default ToasterCustom
