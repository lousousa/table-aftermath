import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CurrencyInput from '@/app/components/CurrencyInput'

import { setStagingItem, clearStagingItem, persistStagingItem } from '@/app/store/reducers/items'
import { addPayment } from '@/app/store/reducers/payments'
import type { RootState } from '@/app/store'

export default function AddItemForm() {
  const payersList = useSelector((state: RootState) => state.payers.list)
  const paymentsList = useSelector((state: RootState) => state.payments.list)
  const currentItem = useSelector((state: RootState) => state.items.stagingItem)
  const dispatch = useDispatch()

  const [paidByAll, setPaidByAll] = useState<boolean>(true)
  const [price, setPrice] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: {[key: string]: string | boolean | number} = {}

    if (e.target.name === 'paidByAll') {
      setPaidByAll(e.target.checked)
    }

    if (e.target.type === 'text')
      input[e.target.name] = e.target.value.trim()

    dispatch(setStagingItem({...input}))
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(clearStagingItem())
  }

  const saveItem = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!currentItem) return

    const checkboxPaidByAll: HTMLInputElement | null =
      document.querySelector('form [name=paidByAll]')

    payersList.forEach(payer => {
      const find = paymentsList.find(payment =>
        payment.payerId === payer.id &&
        payment.itemId === currentItem.id
      )

      if (!find) {
        dispatch(addPayment({
          payerId: payer.id,
          itemId: currentItem.id,
          paid: Boolean(checkboxPaidByAll?.checked)
        }))
      }
    })

    dispatch(setStagingItem({ price: parseFloat(price) }))
    dispatch(persistStagingItem())
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
          value={currentItem?.title}
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