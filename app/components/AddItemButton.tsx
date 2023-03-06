import { Item } from '@/app/types'

type Props = {
  itemsList: Item[],
  setItemsList: React.Dispatch<React.SetStateAction<Item[]>>
}

export default function AddItemButton({itemsList, setItemsList}: Props) {
  const addItem = () => {
    const list = [...itemsList]
    list.push({ id: list.length + 1, price: 10 })

    setItemsList(list)
  }

  return (
    <button
      onClick={() => addItem()}
    >
      (+) adicionar item
    </button>
  )
}