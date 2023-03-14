export const formatCurrency = (value: number | string) =>
    `R$ ${value.toString().replace('.', ',')}`