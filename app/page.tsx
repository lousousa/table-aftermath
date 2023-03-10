'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import PayerCountInput from '@/app/components/PayersCountInput'
import InputGrid from '@/app/components/InputGrid'
import AddItemButton from '@/app/components/AddItemButton'
import AddItemForm from '@/app/components/AddItemForm'
import ResultsSection from '@/app/components/ResultsSection'
import { Payer, Item, Payment, Results } from '@/app/types'

export default function Home() {
  const [payersCount, setPayersCount] = useState<number | ''>(0)
  const [payersList, setPayersList] = useState<Payer[]>([])
  const [itemsList, setItemsList] = useState<Item[]>([])
  const [paymentsList, setPaymentsList] = useState<Payment[]>([])
  const [newItem, setNewItem] = useState<Item | null>(null)
  const [results, setResults] = useState<Results | null>(null)

  useEffect(() => {
    if (!payersCount) return

    const payersList = []
    for(let i = 0; i < Math.min(payersCount, 10); i++) {
      payersList.push({
        id: i + 1,
        name: String.fromCharCode(65 + i)
      })
    }

    setPayersList(payersList)
  }, [payersCount])

  return (
    <div
      className={`p-4 ${inter.className}`}
    >
      <div>
        <PayerCountInput
          payersCount={payersCount}
          setPayersCount={setPayersCount}
        />
        {payersCount > 0 && (
          <div>
            <InputGrid
              payersList={payersList}
              itemsList={itemsList}
              paymentsList={paymentsList}
              setPaymentsList={setPaymentsList}
              setResults={setResults}
            />

            {!newItem && (
              <div
                className='flex flex-col items-start mt-4'
              >
                <AddItemButton
                  itemsList={itemsList}
                  setNewItem={setNewItem}
                />
              </div>
            )}

            {newItem && (
              <AddItemForm
                payersList={payersList}
                newItem={newItem}
                setNewItem={setNewItem}
                setItemsList={setItemsList}
                setPaymentsList={setPaymentsList}
              />
            )}
          </div>
        )}
      </div>

      <ResultsSection
        itemsList={itemsList}
        results={results}
      />
    </div>
  )
}
