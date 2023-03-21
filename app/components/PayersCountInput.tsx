import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { reset as resetPayers } from '@/app/store/reducers/payers'
import { reset as resetItems } from '@/app/store/reducers/items'
import { reset as resetPayments } from '@/app/store/reducers/payments'

type Props = {
  setPayersCount: React.Dispatch<React.SetStateAction<number | ''>>
}

export default function payerCountInput({ setPayersCount }: Props) {
  const dispatch = useDispatch()

  const [currentCount, setCurrentCount] = useState('')

  const onPayersCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '')
      return setCurrentCount('')

    let count = parseInt(e.target.value)
    if (isNaN(count) || count === 0) count = 1
    if (count > 10) count = 10

    setCurrentCount(count.toString())
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!currentCount.length) return

    dispatch(resetPayers())
    dispatch(resetItems())
    dispatch(resetPayments())

    setPayersCount(parseInt(currentCount))
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      <label
        className='mr-2'
      >
        quantidade de pagantes:
      </label>

      <input
        className='border border-gray-600 outline-none'
        value={currentCount}
        onChange={onPayersCountChange}
        type='tel'
      />

      <button
        className='ml-2'
      >
        confirmar
      </button>
    </form>
  )
}