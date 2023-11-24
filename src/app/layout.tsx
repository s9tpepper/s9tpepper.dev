import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
