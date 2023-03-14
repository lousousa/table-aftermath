type Props = {
  payersCount: number | '',
  setPayersCount: React.Dispatch<React.SetStateAction<number | ''>>
}

export default function payerCountInput({ payersCount, setPayersCount }: Props) {
  const onPayersCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '')
      return setPayersCount('')

    let count = parseInt(e.target.value)
    if (isNaN(count)) count = 0

    setPayersCount(count)
  }

  return (
    <div>
      <label
        className='mr-2'
      >
        quantidade de pagantes:
      </label>

      <input
        className='border border-gray-600 outline-none'
        value={payersCount}
        type='number'
        onChange={onPayersCountChange}
      />
    </div>
  )
}