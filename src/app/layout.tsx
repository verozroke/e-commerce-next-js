

import './globals.css'
import type { Metadata } from 'next'
import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toast-provider'
import QueryProvider from '@/components/ui/query-provider'
import { ClerkProvider } from '@clerk/nextjs'



export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard for Next.js e-commerce application',

}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <QueryProvider>
      <ClerkProvider>
        <html lang="en">
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
          </head>
          <body>
            <ToasterProvider />
            <ModalProvider />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </QueryProvider>
  )
}
