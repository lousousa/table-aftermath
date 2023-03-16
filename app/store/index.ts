import { configureStore } from '@reduxjs/toolkit'

import payers from '@/app/store/reducers/payers'
import items from '@/app/store/reducers/items'
import payments from '@/app/store/reducers/payments'

export const store = configureStore({
  reducer: {
    payers,
    items,
    payments
  }
})

export type RootState = ReturnType<typeof store.getState>