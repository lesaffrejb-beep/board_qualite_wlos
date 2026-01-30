import type { Metadata } from 'next'
import './tokens.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Slow Village Qualité - Plateforme d\'Audit',
  description: 'Gestion des audits qualité pour le réseau Slow Village',
  manifest: '/manifest.json',
  themeColor: '#1E4D2B',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SV Qualité',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
