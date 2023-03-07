import { Payer, Item, Payment } from '@/app/types'

type Props = {
  payersList: Payer[],
  itemsList: Item[],
  setPaymentsList: React.Dispatch<React.SetStateAction<Payment[]>>
}

export default function InputGrid({
  payersList,
  itemsList,
  setPaymentsList
}: Props) {

  const checkItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    payerId: number,
    itemId: number,
    price: number
  ) => {
    setPaymentsList(list => {
      if (e.target.checked) {
        const find = list.find(payment =>
          payment.payerId === payerId && payment.itemId === itemId)

        if (find) find.price = price
        else list.push({ payerId, itemId, price })
      } else {
        list = list.filter(payment =>
          payment.payerId !== payerId &&
          payment.itemId !== itemId
        )
      }

      return list
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
                onChange={(e) => checkItem(e, payer.id, item.id, item.price)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}