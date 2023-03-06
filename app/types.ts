export type Payer = {
  id: number,
  name: string,
  payments: number[]
}

export type Item = {
  id: number,
  price: number,
  name?: string
}

export type Payment = {
  payerId: number,
  itemId: number,
  price: number
}

export type ItemFormModel = null | (Item & {
  payedByAll: boolean
})