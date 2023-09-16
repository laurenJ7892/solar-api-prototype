import './globals.css'
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Solar Prototype',
  description: 'Testing the google solar api',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
