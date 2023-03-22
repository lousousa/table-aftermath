import { useDispatch, useSelector } from 'react-redux'

import { clearStagingPayer, setStagingPayer, persistStagingPayer } from '@/app/store/reducers/payers'
import type { RootState } from '@/app/store'

export default function EditPayerForm() {
  const currentPayer = useSelector((state: RootState) => state.payers.stagingPayer)
  const dispatch = useDispatch()

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(clearStagingPayer())
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    dispatch(persistStagingPayer())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: {[key: string]: string} = {}

    input[e.target.name] = e.target.value.trim()

    dispatch(setStagingPayer({...input}))
  }

  return (
    <>
      {currentPayer && (
        <form
          className="mt-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="block"
            >
              nome:
            </label>

            <input
              name="name"
              className="border border-gray-600 outline-none px-2"
              onChange={handleInputChange}
              value={currentPayer.name}
              autoFocus
            />
          </div>

          <div
            className="mt-2"
          >
            {currentPayer.name.length > 0 && (
              <button
                className="text-blue-600 underline font-bold mr-4"
              >
                salvar
              </button>
            )}

            <button
              className="text-red-600 underline font-bold"
              onClick={handleCancel}
            >
              cancelar
            </button>
          </div>
        </form>
      )}
    </>
  )
}