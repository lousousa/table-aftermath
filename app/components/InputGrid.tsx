import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatCurrency } from '@/app/utils'
import { Results } from '@/app/types'

import SavePayerForm from '@/app/components/SavePayerForm'

import { togglePaid, setResults, removePaymentByItemId, reset as resetPayments } from '@/app/store/reducers/payments'
import { setStagingPayer, clearStagingPayer } from '@/app/store/reducers/payers'
import { setStagingItem, clearStagingItem, removeItemById } from '@/app/store/reducers/items'
import type { RootState } from '@/app/store'

export default function InputGrid() {
  const payersList = useSelector((state: RootState) => state.payers.list)
  const itemsList = useSelector((state: RootState) => state.items.list)
  const paymentsList = useSelector((state: RootState) => state.payments.list)
  const dispatch = useDispatch()

  let checkTotal = useRef(0)

  const findPayment = (payerId: number, itemId: number) => {
    return paymentsList.find(payment =>
      payment.payerId === payerId &&
      payment.itemId === itemId
    )
  }

  const checkItem = (
    payerId: number,
    itemId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(togglePaid({
      payerId,
      itemId,
      paid: e.target.checked
    }))
  }

  const showResults = () => {
    if (!paymentsList.length) return

    checkTotal.current = 0
    const payersByItem:{[itemId: number]: number} = {}
    const results: Results = {
      payersData: [],
      total: 0
    }

    itemsList.forEach(item => {
      const filter = paymentsList.filter(payment =>
        payment.itemId === item.id && payment.paid
      )

      payersByItem[item.id] = filter.length
    })

    payersList.forEach(payer => {
      const payerPayments = paymentsList.filter(payment =>
        payment.payerId === payer.id && payment.paid
      )

      let amount = 0
      let calculation = ''

      payerPayments.forEach(payment => {
        const item = itemsList.find(item => item.id === payment.itemId)
        if (item) {
          amount += item.price / payersByItem[item.id]

          if (calculation.length) calculation += '+'
          calculation += `${item.price}/${payersByItem[item.id]}`
        }
      })

      if (amount > 0)
        results.payersData.push({
          payer,
          calculation,
          amount: parseFloat(amount.toFixed(2))
        })

      checkTotal.current += amount
    })

    results.total = parseFloat(checkTotal.current.toFixed(2))
    dispatch(setResults(results))
  }

  const clearStagingData = () => {
    dispatch(clearStagingPayer())
    dispatch(clearStagingItem())
  }

  const editPayer = (payerId: number) => {
    clearStagingData()

    const payer = payersList.find(payer => payer.id === payerId)
    dispatch(setStagingPayer(payer))
  }

  const editItem = (itemId: number) => {
    clearStagingData()

    const item = itemsList.find(item => item.id === itemId)
    dispatch(setStagingItem(item))
  }

  const removeItem = (itemId: number) => {
    dispatch(removeItemById(itemId))

    if (itemsList.length === 1) {
      dispatch(resetPayments())
    } else {
      dispatch(removePaymentByItemId(itemId))
    }
  }

  useEffect(showResults, [dispatch, payersList, itemsList, paymentsList])

  return (
    <div>
      <h2
        className="mt-4 font-bold"
      >
        pagantes:
      </h2>

      <div
        className="flex"
      >
        {payersList.map((payer) => (
          <div
            key={'payer_' + payer.id}
            className='mr-4 cursor-pointer underline'
            onClick={() => editPayer(payer.id)}
          >
            {payer.name}
          </div>
        ))}
      </div>

      <SavePayerForm />

      <div
        className="mt-4"
      >
        <h2
          className="font-bold"
        >
          items / pagamentos:
        </h2>

        <div
          className="flex"
        >
          <div
            className="flex flex-wrap w-full"
          >
            {itemsList.map((item) => (
              <div
                key={'item_' + item.id}
                className="flex pr-2 items-center w-full after:content-[''] after:w-full after:h-1 after:rounded after:bg-gray-400"
              >
                <div
                  className="item-text-wrapper cursor-pointer whitespace-nowrap pr-2"
                  onClick={() => editItem(item.id)}
                >
                  {item.title && (
                    <span>{item.title + ': '}</span>
                  )}

                  <span>{formatCurrency(item.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="pr-4"
          >
            {itemsList.map((item) => (
              <div
                key={'payer_grid_' + item.id}
                className="flex"
              >
                {payersList.map((payer) => (
                  <div key={`payment_input_${payer.id}_${item.id}`}>
                    <input
                      className="mr-2"
                      type="checkbox"
                      checked={findPayment(payer.id, item.id)?.paid}
                      onChange={(e) => checkItem(payer.id, item.id, e)}
                    />
                  </div>
                ))}

                <button
                  className="text-red-600"
                  onClick={() => removeItem(item.id)}
                >
                  (X)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}