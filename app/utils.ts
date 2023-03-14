export const formatCurrency = (value: number | string) =>
    `R$ ${parseFloat(value.toString()).toFixed(2).replace('.', ',')}`