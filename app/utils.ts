import { getDisplayCurrency } from "@/app/i18n";

export const formatCurrency = (value: number | string) => {
  const currency = getDisplayCurrency();
  const amount = parseFloat(value.toString());

  if (currency === "USD") return `$ ${amount.toFixed(2)}`;

  return `R$ ${amount.toFixed(2).replace(".", ",")}`;
};

export const getPayersColors = () => [
  "bg-blue-400",
  "bg-red-400",
  "bg-violet-400",
  "bg-amber-500",
  "bg-green-400",
  "bg-yellow-300",
  "bg-teal-400",
  "bg-pink-300",
  "bg-cyan-400",
  "bg-slate-300",
];
