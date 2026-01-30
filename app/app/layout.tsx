export const metadata = {
  title: 'Slow Village - Qualité Platform',
  description: 'Audit qualité temps réel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
