import { Payer, Item, Payment, Results } from '@/app/types'

type Props = {
  payersList: Payer[],
  itemsList: Item[],
  paymentsList: Payment[],
  setResults: React.Dispatch<React.SetStateAction<Results | null>>
}

export default function ShowResultsButton({
  payersList,
  itemsList,
  paymentsList,
  setResults
}: Props) {

  let checkTotal = 0
  const showResults = () => {
    checkTotal = 0
    const results: Results = { payersData: [], total: 0 }
    const payersByItem:{[itemId: number]: number} = {}

    itemsList.forEach(item => {
      const filter = paymentsList.filter(payment =>
        payment.itemId === item.id && payment.paid
      )

      payersByItem[item.id] = filter.length
    })

    payersList.forEach(payer => {
      const payerPayments = paymentsList.filter(payment =>
        payment.payerId === payer.id && payment.paid
      )

      let amount = 0
      let calculation = ''

      payerPayments.forEach(payment => {
        const item = itemsList.find(item => item.id === payment.itemId)
        if (item) {
          amount += item.price / payersByItem[item.id]

          if (calculation.length) calculation += '+'
          calculation += `${item.price}/${payersByItem[item.id]}`
        }
      })

      results.payersData.push({
        payer,
        calculation,
        amount: parseFloat(amount.toFixed(2))
      })

      checkTotal += amount
    })

    results.total = parseFloat(checkTotal.toFixed(2))
    setResults(results)
  }

  return (
    <button
      onClick={() => showResults()}
    >
      atualizar resultado
    </button>
  )
}