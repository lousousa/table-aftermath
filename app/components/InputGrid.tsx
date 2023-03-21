import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatCurrency } from '@/app/utils'
import { Results } from '@/app/types'

import EditPayerForm from '@/app/components/EditPayerForm'

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
      <div
        className='mt-4 flex'
      >
        {payersList.map((payer) => (
          <div
            key={'payer_' + payer.id}
            className='mr-2 cursor-pointer'
            onClick={() => editPayer(payer.id)}
          >
            {payer.name}
          </div>
        ))}
      </div>

      <EditPayerForm />

      <div
        className="mt-4"
      >
        {itemsList.map((item) => (
          <div
            key={'item_' + item.id}
            className="flex"
          >
            <div
              className="cursor-pointer mr-2"
              onClick={() => editItem(item.id)}
            >
              <span
                className="item-text-wrapper"
              >
                {item.title && (
                  <span>{item.title + ' - '}</span>
                )}

                <span>{formatCurrency(item.price)}</span>
              </span>

              <span>: </span>
            </div>

            {payersList.map((payer) => (
              <div key={`payment_input_${payer.id}_${item.id}`}>
                <input
                  type="checkbox"
                  checked={findPayment(payer.id, item.id)?.paid}
                  onChange={(e) => checkItem(payer.id, item.id, e)}
                />
              </div>
            ))}

            <button
              className="ml-2"
              onClick={() => removeItem(item.id)}
            >
              (X)
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}