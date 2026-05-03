import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TAİS — Türkiye Akademik İşbirliği Sistemi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
      </head>
      <body style={{ margin: 0, padding: 0, cursor: 'none' }}>{children}</body>
    </html>
  )
}