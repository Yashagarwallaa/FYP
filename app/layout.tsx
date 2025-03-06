import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ToasterCustom from "@/components/ToasterCustom";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import 'react-datepicker/dist/react-datepicker.css'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FYP",
  description: "Next generation video calling app",
  icons:{
    icon:'/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <ClerkProvider appearance={{
        layout:{
          logoImageUrl:'/icons/logo.svg',
        },
        variables:{
          colorText: '#fff',
          colorPrimary:'#0E78F9',
          colorBackground:'#1c1f2e',
          colorInputBackground:'#252a41'
        }
      }}>
      <body
        className={`${geistSans.variable} bg-dark-2 ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics/>
        <SpeedInsights/>
        <ToasterCustom/>
      </body>
      </ClerkProvider>
    </html>
  );
}
