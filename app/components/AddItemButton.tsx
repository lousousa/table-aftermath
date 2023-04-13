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
      className="block underline text-blue-600 font-bold"
      onClick={() => addItem()}
    >
      (+) add item
    </button>
  )
}