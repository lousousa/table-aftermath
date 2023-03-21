export type Payer = {
  id: number,
  name: string
}

export type Item = {
  id: number,
  price: number,
  title?: string
}

export type Payment = {
  payerId: number,
  itemId: number,
  paid: boolean
}

type PayerResultData = {
  payer: Payer,
  calculation: string,
  amount: number
}

export type Results = {
  payersData: PayerResultData[],
  total: number,
  showCalculation?: boolean,
  show10Percent?: boolean
}