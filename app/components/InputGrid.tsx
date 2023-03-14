import { Payer, Item, Payment, Results } from '@/app/types'
import { formatCurrency } from '@/app/utils'
import { useEffect, useRef } from 'react'

type Props = {
  payersList: Payer[],
  itemsList: Item[],
  paymentsList: Payment[],
  setPaymentsList: React.Dispatch<React.SetStateAction<Payment[]>>,
  setResults: React.Dispatch<React.SetStateAction<Results | null>>
}

export default function InputGrid({
  payersList,
  itemsList,
  paymentsList,
  setPaymentsList,
  setResults
}: Props) {

  const findPayment = (payerId: number, itemId: number) => {
    return paymentsList.find(payment =>
        payment.payerId === payerId &&
        payment.itemId === itemId
      )
  }

  const checkItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    payerId: number,
    itemId: number
  ) => {

    setPaymentsList(list => {
      const payment = findPayment(payerId, itemId)
      if (payment) payment.paid = e.target.checked

      return [...list]
    })
  }

  let checkTotal = useRef(0)
  const showResults = () => {
    if (!paymentsList.length) return

    checkTotal.current = 0
    const results: Results = { payersData: [], total: 0 }
    const payersByItem:{[itemId: number]: number} = {}

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
    setResults(results)
  }

  useEffect(showResults, [paymentsList, itemsList, payersList, setResults])

  return (
    <div>
      <div
        className='mt-4 flex'
      >
        <div />

        {payersList.map((payer) => (
          <div
            key={'payer_' + payer.id}
          >
            {payer.name}
          </div>
        ))}
      </div>

      {itemsList.map((item) => (
        <div
          key={'item_' + item.id}
          className='flex'
        >
          <div>
            {item.title && (
              <span>{item.title + '; '}</span>
            )}

            <span>{formatCurrency(item.price) + ': '}</span>
          </div>

          {payersList.map((payer) => (
            <div key={`payment_input_${payer.id}_${item.id}`}>
              <input
                type='checkbox'
                checked={findPayment(payer.id, item.id)?.paid}
                onChange={(e) => checkItem(e, payer.id, item.id)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}