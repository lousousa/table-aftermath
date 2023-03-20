import { Item } from '@/app/types'
import { createSlice } from '@reduxjs/toolkit'

type ItemsState = {
  list: Item[],
  stagingItem: Item & { isCreating: boolean } | null
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
        state.stagingItem.title = state.stagingItem.title?.trim()

        if (state.stagingItem.isCreating) {
          state.stagingItem.isCreating = false
          state.list.push(state.stagingItem)
        } else {
          const item = state.list.find(item =>
            item.id === state.stagingItem?.id
          )

          if (item) Object.assign(item, state.stagingItem)
        }

        state.stagingItem = null
      }
    },
    clearStagingItem: (state) => {
      state.stagingItem = null
    },
    removeItemById: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload)
    }
  }
})

export const {
  setStagingItem,
  persistStagingItem,
  clearStagingItem,
  removeItemById
} = slice.actions

export default slice.reducer