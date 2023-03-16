import { useSelector, useDispatch } from 'react-redux'

import { setStagingItem } from '@/app/store/reducers/items'
import type { RootState } from '@/app/store'

export default function AddItemButton() {
  const itemsList = useSelector((state: RootState) => state.items.list)
  const dispatch = useDispatch()

  const addItem = () => {
    dispatch(setStagingItem({
      id: itemsList.length + 1,
      price: 0,
      title: ''
    }))
  }

  return (
    <button
      onClick={() => addItem()}
    >
      (+) adicionar item
    </button>
  )
}