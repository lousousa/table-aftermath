import { Payer } from '@/app/types'
import { createSlice } from '@reduxjs/toolkit'

type PayerState = {
  list: Payer[]
}

const initialState: PayerState = {
  list: []
}

const slice = createSlice({
  name: 'payers',
  initialState,
  reducers: {
    addPayer: (state, action) => {
      state.list.push(action.payload)
    },
    clearPayers: (state) => {
      state.list = []
    }
  }
})

export const { addPayer, clearPayers } = slice.actions

export default slice.reducer