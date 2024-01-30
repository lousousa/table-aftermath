export const formatCurrency = (value: number | string) =>
  `R$ ${parseFloat(value.toString()).toFixed(2).replace('.', ',')}`

export const getPayersColors = () =>
  [
    'bg-red-400',
    'bg-blue-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-orange-300',
    'bg-teal-400',
    'bg-violet-400',
    'bg-pink-300',
    'bg-cyan-400',
    'bg-slate-300'
  ]
