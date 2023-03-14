import { Payer, Item, Payment } from '@/app/types'

type Props = {
  payersList: Payer[],
  itemsList: Item[],
  paymentsList: Payment[],
  setPaymentsList: React.Dispatch<React.SetStateAction<Payment[]>>
}

export default function InputGrid({
  payersList,
  itemsList,
  paymentsList,
  setPaymentsList
}: Props) {

  const findPayment = (payerId: number, itemId: number) => {
    return paymentsList.find(payment =>
        payment.payerId === payerId &&
        payment.itemId === itemId
      )
  }

  const checkItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    payerId: number,
    itemId: number
  ) => {

    setPaymentsList(list => {
      const payment = findPayment(payerId, itemId)
      if (payment) payment.paid = e.target.checked

      return [...list]
    })
  }

  return (
    <div>
      <div
        className='flex'
      >
        <div />

        {payersList.map((payer) => (
          <div
            key={'payer_' + payer.id}
          >
            {payer.name}
          </div>
        ))}
      </div>

      {itemsList.map((item) => (
        <div
          key={'item_' + item.id}
          className='flex'
        >
          <div>
            {item.price}
          </div>

          {payersList.map((payer) => (
            <div key={`payment_input_${payer.id}_${item.id}`}>
              <input
                type='checkbox'
                checked={findPayment(payer.id, item.id)?.paid}
                onChange={(e) => checkItem(e, payer.id, item.id)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}