'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import PayerCountInput from '@/app/components/PayersCountInput'
import InputGrid from '@/app/components/InputGrid'
import AddItemButton from '@/app/components/AddItemButton'
import ShowResultsButton from '@/app/components/ShowResultsButton'
import AddItemForm from '@/app/components/AddItemForm'
import { Payer, Item, Payment, ItemFormModel } from '@/app/types'

export default function Home() {
  const [payersCount, setPayersCount] = useState<number | ''>(0)
  const [payersList, setPayersList] = useState<Payer[]>([])
  const [itemsList, setItemsList] = useState<Item[]>([])
  const [paymentsList, setPaymentsList] = useState<Payment[]>([])
  const [newItem, setNewItem] = useState<ItemFormModel | null>(null)

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
      <PayerCountInput
        payersCount={payersCount}
        setPayersCount={setPayersCount}
      />

      {payersCount > 0 && (
        <div>
          <InputGrid
            payersList={payersList}
            itemsList={itemsList}
            setPaymentsList={setPaymentsList}
          />

          {!newItem && (
            <div
              className='flex flex-col items-start'
            >
              <AddItemButton
                itemsList={itemsList}
                setNewItem={setNewItem}
              />

              {itemsList.length > 0 && (
                <ShowResultsButton
                  payersList={payersList}
                  itemsList={itemsList}
                  paymentsList={paymentsList}
                />
              )}
            </div>
          )}

          {newItem && (
            <AddItemForm
              newItem={newItem}
              setNewItem={setNewItem}
              setItemsList={setItemsList}
            />
          )}
        </div>
      )}
    </div>
  )
}
