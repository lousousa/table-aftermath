import { useEffect, useState } from 'react'
import { Item, Results } from '@/app/types'
import { formatCurrency } from '@/app/utils'

type Props = {
  results: Results | null,
  itemsList: Item[]
}

export default function ResultsSection({results, itemsList}: Props) {
  const [checkedResults, setCheckedResults] = useState('')

  const add10Percent = (value: number) => (value + value * .1).toFixed(2)

  useEffect(() => {
    if (!results) return

    const itemsTotal = itemsList.reduce((accumulator, current) =>
      accumulator += current.price, 0
    )

    if (results?.total !== itemsTotal)
      return setCheckedResults(`total: ${formatCurrency(results.total)}
        (falta ${formatCurrency(itemsTotal - results?.total)})`)

    return setCheckedResults(`total: ${formatCurrency(results.total)}
      (${formatCurrency(add10Percent(results.total))})`)
  }, [itemsList, results])

  return (
    <>
      {results && (
        <div
          className='mt-4'
        >
          {results.payersData.map((payerData) => (
            <div
              key={`results_payer_${payerData.payer.id}`}
            >
              <p>
                {payerData.payer.name}: {payerData.calculation} =&nbsp;
                {formatCurrency(payerData.amount)}&nbsp;
                ({formatCurrency(add10Percent(payerData.amount))})
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