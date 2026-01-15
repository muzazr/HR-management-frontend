import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import './globals.css'

const urbanist = Urbanist({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'], // Pilih weight yang kamu butuhkan
  variable: '--font-urbanist', // Optional: CSS variable
})

export const metadata: Metadata = {
  title: 'TalentHub',
  description: 'Recruitment Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        {children}
      </body>
    </html>
  )
}