import { Roboto } from 'next/font/google'
import React from 'react'
import Providers from './Providers'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const bodyStyle = {
  margin: 0,
  padding: 0,
} as const

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={bodyStyle} className={roboto.className}>
        <Providers fontFamily={roboto.style.fontFamily}>{children}</Providers>
      </body>
    </html>
  )
}
