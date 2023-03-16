'use client'

import { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/app/store'

type Props = {
  children: ReactNode
}

export default function Provider ({ children }: Props) {
  return (
    <ReduxProvider store={store}>
      {children}
    </ReduxProvider>
  )
}