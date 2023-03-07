export type Payer = {
  id: number,
  name: string
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

export type ItemFormModel = Item & {
  payedByAll: boolean
}