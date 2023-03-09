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

    const payersByItem:{[itemId: number]: number} = {}
    const results: Results = { payersData: [], total: 0 }

    itemsList.forEach(item => {
      const filter = paymentsList.filter(payment => payment.itemId === item.id)
      payersByItem[item.id] = filter.length
    })

    payersList.forEach(payer => {
      let amount = 0
      const filter = paymentsList.filter(payment => payment.payerId === payer.id)
      let calculation = ''

      filter.forEach(payment => {
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