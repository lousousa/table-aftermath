import { Item } from '@/app/types'

type Props = {
  itemsList: Item[]
  setNewItem: React.Dispatch<React.SetStateAction<Item | null>>
}

export default function AddItemButton({itemsList, setNewItem}: Props) {
  const addItem = () => {
    setNewItem({
      id: itemsList.length + 1,
      price: 0,
      title: ''
    })
  }

  return (
    <button
      onClick={() => addItem()}
    >
      (+) adicionar item
    </button>
  )
}