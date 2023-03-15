import { useEffect } from 'react'

type Props = {
  setPayerOnEdit: React.Dispatch<React.SetStateAction<number>>
}

export default function EditPayerForm({setPayerOnEdit}: Props) {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    setPayerOnEdit(0)
  }

  useEffect(() => {
    setPayerOnEdit((payerId: number) => {
      // todo: find payer on the state management
      console.log(payerId)

      return payerId
    })
  }, [setPayerOnEdit])

  return (
    <form>
      <div>
        <label>name:</label>
      </div>

      <div>
        <input/>
      </div>

      <div>
        <button>
          salvar
        </button>

        <button
          onClick={handleCancel}
        >
          cancelar
        </button>
      </div>
    </form>
  )
}