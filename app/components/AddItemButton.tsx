import { Item, ItemFormModel } from '@/app/types'

type Props = {
  itemsList: Item[]
  setNewItem: React.Dispatch<React.SetStateAction<ItemFormModel | null>>
}

export default function AddItemButton({itemsList, setNewItem}: Props) {
  const addItem = () => {
    setNewItem({
      id: itemsList.length + 1,
      price: 0,
      name: '',
      payedByAll: true
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