import '@/app/globals.css'
import Provider from '@/app/store/provider'

export const metadata = {
  title: 'Bar Bill Calculator',
  description: 'A tool for calculating and dividing between people the current bar or restaurant bill.',
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
