import './globals.css'

export const metadata = {
  title: 'Table Aftermath',
  description: 'A tool for help to divide and calculate the actually bar bill.',
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
