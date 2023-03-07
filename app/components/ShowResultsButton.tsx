import { Payer, Item, Payment } from '@/app/types'

type Props = {
  payersList: Payer[],
  itemsList: Item[],
  paymentsList: Payment[]
}

export default function ShowResultsButton({payersList, itemsList, paymentsList}: Props) {
  let checkTotal = 0
  const showResults = () => {
    checkTotal = 0

    const payersByItem:{[itemId: number]: number} = {}

    itemsList.forEach(item => {
      const filter = paymentsList.filter(payment => payment.itemId === item.id)
      payersByItem[item.id] = filter.length
    })

    payersList.forEach(payer => {
      let total = 0
      const filter = paymentsList.filter(payment => payment.payerId === payer.id)
      let calculation = ''

      filter.forEach(payment => {
        const item = itemsList.find(item => item.id === payment.itemId)
        if (item) {
          total += item.price / payersByItem[item.id]

          if (calculation.length) calculation += '+'
          calculation += `${item.price}/${payersByItem[item.id]}`
        }
      })

      console.log(payer.name + ':' ,calculation ,'=' , total.toFixed(2))
      checkTotal += total
    })

    console.log('TOTAL: ', checkTotal.toFixed(2))
  }

  return (
    <button
      onClick={() => showResults()}
    >
      resultado
    </button>
  )
}