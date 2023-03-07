export type Payer = {
  id: number,
  name: string
}

export type Item = {
  id: number,
  price: number,
  name?: string,
  payedByAll?: boolean
}

export type Payment = {
  payerId: number,
  itemId: number
}
