import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatCurrency } from '@/app/utils'

import type { RootState } from '@/app/store'

export default function ResultsSection() {
  const itemsList = useSelector((state: RootState) => state.items.list)
  const currentResults = useSelector((state: RootState) => state.payments.results)

  const [checkedResults, setCheckedResults] = useState('')

  const add10Percent = (value: number) => (value + value * .1).toFixed(2)

  useEffect(() => {
    if (!currentResults) return

    const itemsTotal = itemsList.reduce((accumulator, current) =>
      accumulator += current.price, 0
    )

    if (currentResults.total !== parseFloat(itemsTotal.toFixed(2)))
      return setCheckedResults(`total: ${formatCurrency(currentResults.total)}
        (falta ${formatCurrency(itemsTotal - currentResults.total)})`)

    let checkedResults = `total: ${formatCurrency(currentResults.total)}`

    if (currentResults.show10Percent)
      checkedResults += `(${formatCurrency(add10Percent(currentResults.total))})`

    return setCheckedResults(checkedResults)
  }, [itemsList, currentResults])

  return (
    <>
      {currentResults && currentResults.total > 0 && (
        <div
          className='mt-4'
        >
          {currentResults.payersData.map((payerData) => (
            <div
              key={`results_payer_${payerData.payer.id}`}
            >
              <p>
                {payerData.payer.name}:&nbsp;

                {currentResults.showCalculation && (
                  <span>
                    {payerData.calculation} =&nbsp;
                  </span>
                )}

                {formatCurrency(payerData.amount)}&nbsp;

                {currentResults.show10Percent && (
                  <span>
                    ({formatCurrency(add10Percent(payerData.amount))})
                  </span>
                )}
              </p>
            </div>
          ))}

          {checkedResults.length && (
            <p
              className='mt-4'
            >
              {checkedResults}
            </p>
          )}
        </div>
      )}
    </>
  )
}