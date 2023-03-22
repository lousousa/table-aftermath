import '@/app/globals.css'
import Provider from '@/app/store/provider'

export const metadata = {
  title: 'Table Aftermath',
  description: 'A tool for helping to divide and calculate the bar bill.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
