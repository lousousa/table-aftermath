import { Payer } from '@/app/types'
import { createSlice } from '@reduxjs/toolkit'

type PayerState = {
  list: Payer[],
  stagingPayer: Payer | null
}

const initialState: PayerState = {
  list: [],
  stagingPayer: null
}

const slice = createSlice({
  name: 'payers',
  initialState,
  reducers: {
    addPayer: (state, action) => {
      state.list.push(action.payload)
    },
    setStagingPayer: (state, action) => {
      if (!state.stagingPayer)
        state.stagingPayer = action.payload

      else
        state.stagingPayer = {
          ...state.stagingPayer,
          ...action.payload
        }
    },
    persistStagingPayer: (state) => {
      if (state.stagingPayer) {
        state.stagingPayer.name = state.stagingPayer.name?.trim()

        let payer = state.list.find(payer =>
          payer.id === state.stagingPayer?.id
        )

        if (payer) {
          Object.assign(payer, state.stagingPayer)
          state.stagingPayer = null
        }
      }
    },
    clearStagingPayer: (state) => {
      state.stagingPayer = null
    },
    clearPayers: (state) => {
      state.list = []
    },
    reset: () => {
      return initialState
    }
  }
})

export const {
  addPayer,
  setStagingPayer,
  persistStagingPayer,
  clearStagingPayer,
  clearPayers,
  reset
} = slice.actions

export default slice.reducer