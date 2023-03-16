'use client'

import { Payment, Results } from '@/app/types'
import { createSlice } from '@reduxjs/toolkit'

type PaymentsState = {
  list: Payment[],
  results: Results | null
}

const initialState: PaymentsState = {
  list: [],
  results: null
}

const slice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      state.list.push(action.payload)
    },
    togglePaid: (state, action) => {
      const { payerId, itemId, paid } = action.payload

      const payment = state.list.find(payment =>
        payment.payerId === payerId &&
        payment.itemId === itemId
      )

      if (payment) payment.paid = paid
    },
    setResults: (state, action) => {
      state.results = action.payload
    }
  }
})

export const { addPayment, togglePaid, setResults } = slice.actions

export default slice.reducer