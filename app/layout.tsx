import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Susan Future Technologies — Persistent Aerial Infrastructure',
  description:
    'Susan Future Technologies builds deployable and high-altitude aerial platforms for communication, monitoring, and mission-critical operations. HAWKE & MOBIUS — the next layer of connectivity.',
  keywords: [
    'HAPS',
    'High Altitude Platform Systems',
    'Aerial Infrastructure',
    'HAWKE',
    'MOBIUS',
    'Tethered Aerostat',
    'Communication Platform',
    'Defence Technology',
    'Susan Future Technologies',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
