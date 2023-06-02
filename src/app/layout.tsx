'use client'

import './globals.css'
import { ThemeProvider } from '../components/material-tailwind/components'
import { Inter } from 'next/font/google'
import { SnackbarProvider } from 'notistack'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'syonet',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <SnackbarProvider
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            dense
            autoHideDuration={1500}
          >
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
