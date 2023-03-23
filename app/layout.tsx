import '@/app/globals.css'
import Provider from '@/app/store/provider'

export const metadata = {
  title: 'calculadora de bar',
  description: 'ferramenta para calcular e dividir entre as pessoas a conta do bar.',
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
