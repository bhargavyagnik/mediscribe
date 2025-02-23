import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: 'Mediscribe',
  description: 'Helping doctors and patients for smoother healthcare',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
