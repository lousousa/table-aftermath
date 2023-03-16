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
        let found = state.list.find(payer =>
          payer.id === state.stagingPayer?.id
        )

        if (found) {
          Object.assign(found, state.stagingPayer)
          state.stagingPayer = null
        }
      }
    },
    clearStagingPayer: (state) => {
      state.stagingPayer = null
    },
    clearPayers: (state) => {
      state.list = []
    }
  }
})

export const {
  addPayer,
  setStagingPayer,
  persistStagingPayer,
  clearStagingPayer,
  clearPayers
} = slice.actions

export default slice.reducer