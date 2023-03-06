'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

type Payer = {
  id: number,
  name: string,
  payments: number[]
}

type Item = {
  id: number,
  price: number,
  name?: string
}

type Payment = {
  payerId: number,
  itemId: number,
  price: number
}

export default function Home() {
  const [payersCount, setPayersCount] = useState<number | ''>(0)
  const [payersList, setPayersList] = useState<Payer[]>([])
  const [itemsList, setItemsList] = useState<Item[]>([])
  const [paymentList, setPaymentList] = useState<Payment[]>([])

  const onPayersCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '')
      return setPayersCount('')

    let count = parseInt(e.target.value)
    if (isNaN(count)) count = 0

    setPayersCount(count)
  }

  const addItem = () => {
    const list = [...itemsList]
    list.push({ id: list.length + 1, price: 10 })

    setItemsList(list)
  }

  const checkItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    payerId: number,
    itemId: number,
    price: number
  ) => {
    let list = [...paymentList]

    if (e.target.checked) {
      list.push({ payerId, itemId, price })
    } else {
      list = list.filter(payment =>
        payment.payerId !== payerId &&
        payment.itemId !== itemId
      )
    }

    setPaymentList(list)
  }

  let checkTotal = 0
  const showResults = () => {
    checkTotal = 0

    const payersByItem:{[itemId: number]: number} = {}

    itemsList.forEach(item => {
      const filter = paymentList.filter(payment => payment.itemId === item.id)
      payersByItem[item.id] = filter.length
    })

    payersList.forEach(payer => {
      let total = 0
      const filter = paymentList.filter(payment => payment.payerId === payer.id)
      filter.forEach(item => {
        total += item.price / payersByItem[item.itemId]
      })

      console.log(payer.name + ':' , total.toFixed(2))
      checkTotal += total
    })

    console.log('TOTAL: ', checkTotal.toFixed(2))
  }

  useEffect(() => {
    if (!payersCount) return

    const payersList = []
    for(let i = 0; i < Math.min(payersCount, 10); i++) {
      payersList.push({
        id: i + 1,
        name: String.fromCharCode(65 + i),
        payments: []
      })
    }

    setPayersList(payersList)
  }, [payersCount])

  return (
    <div
      className={inter.className}
    >
      <div
        className='p-2'
      >
        <label
          className='mr-2'
        >
          quantidade de pagantes:
        </label>

        <input
          className='border border-gray-600 outline-none'
          value={payersCount}
          type='number'
          onChange={onPayersCountChange}
        />
      </div>

      {payersCount > 0 && (
        <div>
          <div>
            <div
              className='flex'
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
                className='flex'
              >
                <div key={'item_' + item.id}>
                  {item.price}
                </div>

                {payersList.map((payer) => (
                  <div key={`payment_input_${payer.id}_${item.id}`}>
                    <input
                      type='checkbox'
                      onChange={(e) => checkItem(e, payer.id, item.id, item.price)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div
            className='flex flex-col items-start'
          >
            <button
              onClick={() => addItem()}
            >
              (+) adicionar item
            </button>

            {itemsList.length > 0 && (
              <button
                onClick={() => showResults()}
              >
                resultado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
