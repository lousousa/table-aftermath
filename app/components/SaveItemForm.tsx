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
    const input: {[key: string]: string | boolean} = {}

    if (e.target.name === 'paidByAll')
      setPaidByAll(e.target.checked)

    if (e.target.type === 'text')
      input[e.target.name] = e.target.value

    dispatch(setStagingItem({...input}))
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(clearStagingItem())
  }

  const saveItem = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!currentItem) return

    if (currentItem.isCreating) {
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
    }

    dispatch(setStagingItem({ price: parseFloat(price.replace(',', '.')) }))
    dispatch(persistStagingItem())
  }

  return (
    <form
      className="mt-4 bg-gray-200 p-4 rounded"
      onSubmit={saveItem}
    >
      <div>
        <label
          className="block"
        >
          preço:
        </label>

        <CurrencyInput
          setStateAction={setPrice}
          maxLength={6}
          autoFocus={true}
          initialValue={currentItem?.price}
          customClasses="rounded outline-none py-1 px-2 w-full"
        />
      </div>

      <div>
        <label
          className="block mt-2"
        >
          descrição (opcional):
        </label>

        <input
          name="title"
          value={currentItem?.title}
          onChange={handleInputChange}
          className="rounded outline-none py-1 px-2 text-right w-full"
        />
      </div>

      {currentItem?.isCreating && (
        <div
          className="mt-2 text-right"
        >
          <input
            id="paid_by_all_checkbox"
            name="paidByAll"
            type="checkbox"
            checked={paidByAll}
            onChange={handleInputChange}
          />

          <label
            className="ml-2"
            htmlFor="paid_by_all_checkbox"
          >
            todos pagam
          </label>
        </div>
      )}

      <div
        className="mt-2 text-right"
      >
        <button
          className="text-red-600 underline font-bold"
          onClick={handleCancel}
        >
          cancelar
      </button>

        <button
          className="text-blue-600 underline font-bold ml-4"
        >
          salvar
        </button>
      </div>
    </form>
  )
}