import { Payer, Item, Payment } from '@/app/types'
import { useState } from 'react'

type Props = {
  payersList: Payer[],
  newItem: Item,
  setNewItem: React.Dispatch<React.SetStateAction<Item | null>>,
  setItemsList: React.Dispatch<React.SetStateAction<Item[]>>,
  setPaymentsList: React.Dispatch<React.SetStateAction<Payment[]>>
}

export default function AddItemForm({
  payersList,
  newItem,
  setNewItem,
  setItemsList,
  setPaymentsList
}: Props) {

  const [paidByAll, setPaidByAll] = useState<boolean>(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: {[key: string]: string | boolean | number} = {}

    if (e.target.name === 'paidByAll') {
      setPaidByAll(e.target.checked)
    }

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

    const checkboxPaidByAll: HTMLInputElement | null =
      document.querySelector('form [name=paidByAll]')

    setPaymentsList(paymentsList => {
      payersList.forEach(payer => {
        const find = paymentsList.find(payment =>
          payment.payerId === payer.id &&
          payment.itemId === newItem.id
        )

        if (!find) paymentsList.push({
          payerId: payer.id,
          itemId: newItem.id,
          paid: Boolean(checkboxPaidByAll?.checked)
        })
      })

      return paymentsList
    })

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
          autoFocus
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
          name="paidByAll"
          type="checkbox"
          checked={paidByAll}
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