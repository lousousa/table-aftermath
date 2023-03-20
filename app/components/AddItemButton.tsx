import { useDispatch } from 'react-redux'

import { setStagingItem } from '@/app/store/reducers/items'

export default function AddItemButton() {
  const dispatch = useDispatch()

  const addItem = () => {
    dispatch(setStagingItem({
      id: Date.now(),
      price: 0,
      title: '',
      isCreating: true
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