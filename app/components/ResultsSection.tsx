import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatCurrency } from '@/app/utils'

import ResultsOptions from '@/app/components/ResultsOptions'
import CopyResultsButton from '@/app/components/CopyResultsButton'
import CopyItemsButton from '@/app/components/CopyItemsButton'
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

    let checkedResults = ''

    if (currentResults.show10Percent) {
      let totalAdd10Percent = parseFloat(add10Percent(currentResults.total))
      let itemsAdd10Percent = parseFloat(add10Percent(itemsTotal))

      if (totalAdd10Percent !== itemsAdd10Percent) {
        checkedResults = `total: ${formatCurrency(totalAdd10Percent)} (falta ${formatCurrency(itemsAdd10Percent - totalAdd10Percent)})`
      } else {
        if (currentResults.showCalculation) {
          checkedResults = `total: ${formatCurrency(currentResults.total)} (${formatCurrency(totalAdd10Percent)})`
        } else {
          checkedResults = `total: ${formatCurrency(totalAdd10Percent)}`
        }
      }
    } else {
      if (currentResults.total !== parseFloat(itemsTotal.toFixed(2))) {
        checkedResults = `total: ${formatCurrency(currentResults.total)} (falta ${formatCurrency(itemsTotal - currentResults.total)})`
      } else {
        checkedResults = `total: ${formatCurrency(currentResults.total)}`
      }
    }

    return setCheckedResults(checkedResults)
  }, [itemsList, currentResults])

  return (
    <>
      {currentResults && currentResults.total > 0 && (
        <div
          className="mt-6"
        >
          <div
            className="bg-gray-200 rounded p-4"
          >
            <h2
              className="font-bold"
            >
              divisão:
            </h2>

            <div
              id="results_content"
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

                    {currentResults.show10Percent && (
                      <>
                        {currentResults.showCalculation && (
                          <span>
                            {formatCurrency(payerData.amount)} ({formatCurrency(add10Percent(payerData.amount))})
                          </span>
                        )}

                        {!currentResults.showCalculation && (
                          <span>
                            {formatCurrency(add10Percent(payerData.amount))}
                          </span>
                        )}
                      </>
                    )}

                    {!currentResults.show10Percent && (
                      <span>
                        {formatCurrency(payerData.amount)}
                      </span>
                    )}
                  </p>
                </div>
              ))}

              {checkedResults.length && (
                <p
                  className="mt-4 font-bold"
                >
                  {checkedResults}
                </p>
              )}
            </div>
          </div>

          <ResultsOptions />

          <div
            className="mt-4"
          >
            <h2
              className="font-bold"
            >
              compartilhar:
            </h2>

            <CopyItemsButton />

            <CopyResultsButton />
          </div>
        </div>
      )}
    </>
  )
}