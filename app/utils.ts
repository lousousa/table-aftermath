export const formatCurrency = (value: number | string) =>
  `$ ${parseFloat(value.toString()).toFixed(2).replace('.', ',')}`