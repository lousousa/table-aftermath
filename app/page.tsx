'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Inter } from 'next/font/google'

import PayerCountInput from '@/app/components/PayersCountInput'
import InputGrid from '@/app/components/InputGrid'
import AddItemButton from '@/app/components/AddItemButton'
import AddItemForm from '@/app/components/AddItemForm'
import ResultsSection from '@/app/components/ResultsSection'

import { addPayer, clearPayers } from '@/app/store/reducers/payers'
import type { RootState } from '@/app/store'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const currentItem = useSelector((state: RootState) => state.items.stagingItem)
  const dispatch = useDispatch()

  const [payersCount, setPayersCount] = useState<number | ''>(0)

  useEffect(() => {
    if (!payersCount) return

    dispatch(clearPayers())

    for(let i = 0; i < Math.min(payersCount, 10); i++) {
      dispatch(addPayer({
        id: i + 1,
        name: String.fromCharCode(65 + i)
      }))
    }
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
            <InputGrid />

            {!currentItem && (
              <div
                className='flex flex-col items-start mt-4'
              >
                <AddItemButton />
              </div>
            )}

            {currentItem && (
              <AddItemForm />
            )}
          </div>
        )}
      </div>

      <ResultsSection />
    </div>
  )
}
