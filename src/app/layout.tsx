import type { Metadata } from 'next'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'

import { fileRouter } from './api/uploadthing/core'

import './globals.css'
import { extractRouterConfig } from 'uploadthing/server'

export const metadata: Metadata = {
  title: 's9tpepper.dev',
  description: 'Coding, gardening, BBQ, in no particular order...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        {children}
      </body>
    </html>
  )
}
