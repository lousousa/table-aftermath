'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Inter } from 'next/font/google'

import PayerCountInput from '@/app/components/PayersCountInput'
import InputGrid from '@/app/components/InputGrid'
import AddItemButton from '@/app/components/AddItemButton'
import SaveItemForm from '@/app/components/SaveItemForm'
import ResultsSection from '@/app/components/ResultsSection'

import { addPayer, clearPayers } from '@/app/store/reducers/payers'
import type { RootState } from '@/app/store'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const currentItem = useSelector((state: RootState) => state.items.stagingItem)
  const currentPayer = useSelector((state: RootState) => state.payers.stagingPayer)
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
  }, [dispatch, payersCount])

  return (
    <div
      className={`${inter.className}`}
    >
      <header
        className="bg-gray-900"
      >
        <h1
          className="font-medium text-2xl text-white p-4 mx-auto max-w-lg"
        >
          calculadora rústica
        </h1>
      </header>

      <div
        className="p-4 max-w-lg mx-auto"
      >
        <div>
          <PayerCountInput
            setPayersCount={setPayersCount}
          />
          {payersCount > 0 && (
            <div>
              <InputGrid />

              {!currentItem && !currentPayer && (
                <div
                  className='mt-4'
                >
                  <AddItemButton />
                </div>
              )}

              {currentItem && (
                <SaveItemForm />
              )}
            </div>
          )}
        </div>

        <ResultsSection />
      </div>

      <footer
        className="text-center mt-4 pt-4 border-gray-300 text-sm border-t-2"
      >
        <span>desenvolvido por </span>
        <a className="font-bold" href="https://github.com/lousousa">@lousousa</a>
        <span> ● 2023</span>
      </footer>
    </div>
  )
}
