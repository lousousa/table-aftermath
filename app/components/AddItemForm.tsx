import { Item, ItemFormModel } from '@/app/types'

type Props = {
  newItem: ItemFormModel,
  setNewItem: React.Dispatch<React.SetStateAction<ItemFormModel | null>>,
  setItemsList: React.Dispatch<React.SetStateAction<Item[]>>
}

export default function AddItemForm({
  newItem,
  setNewItem,
  setItemsList
}: Props) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: {[key: string]: string | boolean | number} = {}

    if (e.target.type === 'checkbox')
      input[e.target.name] = e.target.checked

    if (e.target.type === 'text')
      input[e.target.name] = e.target.value

    if (e.target.type === 'number') {
      let value: number | string = ''

      if (e.target.value !== value) {
        value = parseFloat(e.target.value)
        if (isNaN(value)) value = 0
      }

      input[e.target.name] = value
    }

    setNewItem({...newItem, ...input})
  }

  const saveItem = (e: React.SyntheticEvent) => {
    e.preventDefault()

    setItemsList(itemList => [...itemList, newItem])
    setNewItem(null)
  }

  return (
    <form
      onSubmit={saveItem}
    >
      <div>
        <label>preço:</label>

        <input
          name="price"
          type="number"
          value={newItem.price}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>título (opcional):</label>

        <input
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <input
          name="payedByAll"
          type="checkbox"
          checked={newItem.payedByAll}
          onChange={handleInputChange}
        />

        <label>todos pagam?</label>
      </div>

      <button>
        adicionar
      </button>
    </form>
  )
}