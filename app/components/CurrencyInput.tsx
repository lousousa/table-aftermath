import { useEffect, useRef } from "react"

type Props = {
  setStateAction: React.Dispatch<React.SetStateAction<string>>,
  maxLength: number,
  autoFocus: boolean
}

export default function CurrencyInput({setStateAction, maxLength, autoFocus}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const inputCaretToLastPosition = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!(e.target instanceof HTMLInputElement)) return

    const pos = e.target.value.length
    e.target.focus()
    e.target.setSelectionRange(pos, pos)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value) return

    value = value.replace(/\D/g, '')

    if (value.length > maxLength - 1) value = value.substring(0, maxLength - 1)

    while (value.length < 4) {
      value = '0' + value
    }

    while (value.length >= 4 && value[0] === '0') {
      value = value.substring(1)
    }

    value = `${ value.substring(0, value.length - 2) },${ value.substring(value.length - 2) }`

    if (inputRef.current) inputRef.current.value = value
    setStateAction(parseFloat(value.replace(',', '.')).toFixed(2))
  }

  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.value = '0,00'
  }, [inputRef])

  return (
    <input
      ref={inputRef}
      type="tel"
      onKeyUp={inputCaretToLastPosition}
      onClick={inputCaretToLastPosition}
      onChange={handleChange}
      autoFocus={autoFocus}
      className="text-right"
    />
  )
}