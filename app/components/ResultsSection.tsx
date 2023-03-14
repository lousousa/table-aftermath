import { useEffect, useState } from 'react'
import { Item, Results } from '../types'

type Props = {
  results: Results | null,
  itemsList: Item[]
}

export default function ResultsSection({results, itemsList}: Props) {
  const [checkedResults, setCheckedResults] = useState('')

  useEffect(() => {
    if (!results) return

    const itemsTotal = itemsList.reduce((accumulator, current) =>
      accumulator += current.price, 0
    )

    if (results?.total !== itemsTotal)
      return setCheckedResults(`total pago: ${results?.total} (falta ${itemsTotal - results?.total})`)

    return setCheckedResults(`total pago: ${results?.total}`)
  }, [itemsList, results])

  return (
    <>
      {results && (
        <div>
          {results.payersData.map((payerData) => (
            <div
              key={`results_payer_${payerData.payer.id}`}
            >
              <p>
                {payerData.payer.name}: {payerData.calculation} = {payerData.amount}
              </p>
            </div>
          ))}

          {checkedResults.length && (
            <p>
              {checkedResults}
            </p>
          )}
        </div>
      )}
    </>
  )
}