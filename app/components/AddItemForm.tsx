import { Payer, Item, Payment } from '@/app/types'
import { useState } from 'react'

import CurrencyInput from '@/app/components/CurrencyInput'

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
  const [price, setPrice] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: {[key: string]: string | boolean | number} = {}

    if (e.target.name === 'paidByAll') {
      setPaidByAll(e.target.checked)
    }

    if (e.target.type === 'text')
      input[e.target.name] = e.target.value.trim()

    setNewItem({...newItem, ...input})
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    setNewItem(null)
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

    newItem.price = parseFloat(price)

    setItemsList(itemList => [...itemList, newItem])
    setNewItem(null)
  }

  return (
    <form
      className='mt-4'
      onSubmit={saveItem}
    >
      <div>
        <label>preço:</label>

        <CurrencyInput
          setStateAction={setPrice}
          maxLength={6}
          autoFocus={true}
        />
      </div>

      <div>
        <label>título (opcional):</label>

        <input
          name="title"
          value={newItem.title}
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

        <label
          className='ml-2'
        >
          todos pagam?
        </label>
      </div>

      <button>
        adicionar
      </button>

      <button
        className='ml-4'
        onClick={handleCancel}
      >
        cancelar
      </button>
    </form>
  )
}