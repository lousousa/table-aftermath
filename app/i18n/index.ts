import enUs from '@/app/i18n/en-us.json'
import ptBr from '@/app/i18n/pt-br.json'

type Dictionary = typeof ptBr
type TranslationKey = keyof Dictionary

type Language = 'pt-br' | 'en-us'
type Currency = 'BRL' | 'USD'

const dictionaries: Record<Language, Dictionary> = {
  'pt-br': ptBr,
  'en-us': enUs,
}

export const getDisplayLanguage = (): Language => {
  const language = process.env.NEXT_PUBLIC_DISPLAY_LANGUAGE?.toLowerCase()

  if (language === 'en-us' || language === 'pt-br') return language

  return 'pt-br'
}

export const getDisplayCurrency = (): Currency => {
  const currency = process.env.NEXT_PUBLIC_DISPLAY_CURRENCY?.toUpperCase()

  if (currency === 'USD' || currency === 'BRL') return currency

  return 'BRL'
}

export const getDictionary = () => dictionaries[getDisplayLanguage()]

export const t = (
  key: TranslationKey,
  replacements: Record<string, string | number> = {}
) => {
  const translation = getDictionary()[key] ?? ptBr[key] ?? key

  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    translation
  )
}
