import { Item } from '@/app/types'
import { createSlice } from '@reduxjs/toolkit'

type ItemsState = {
  list: Item[],
  stagingItem: Item | null
}

const initialState: ItemsState = {
  list: [],
  stagingItem: null
}

const slice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setStagingItem: (state, action) => {
      if (!state.stagingItem)
        state.stagingItem = action.payload

      else
        state.stagingItem = {
          ...state.stagingItem,
          ...action.payload
        }
    },
    persistStagingItem: (state) => {
      if (state.stagingItem) {
        state.list.push(state.stagingItem)
        state.stagingItem = null
      }
    },
    clearStagingItem: (state) => {
      state.stagingItem = null
    }
  }
})

export const {
  setStagingItem,
  persistStagingItem,
  clearStagingItem
} = slice.actions

export default slice.reducer