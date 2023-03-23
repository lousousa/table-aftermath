import { useDispatch, useSelector } from 'react-redux'

import { clearStagingPayer, setStagingPayer, persistStagingPayer } from '@/app/store/reducers/payers'
import type { RootState } from '@/app/store'

export default function SavePayerForm() {
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

    input[e.target.name] = e.target.value

    dispatch(setStagingPayer({...input}))
  }

  return (
    <>
      {currentPayer && (
        <form
          className="mt-4 bg-gray-200 p-4 rounded"
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
              className="w-full rounded outline-none py-1 px-2 text-right"
              onChange={handleInputChange}
              value={currentPayer.name}
              autoFocus
            />
          </div>

          <div
            className="mt-2 text-right"
          >
            <button
              type="button"
              className="text-red-600 underline font-bold"
              onClick={handleCancel}
            >
              cancelar
            </button>

            {currentPayer.name.length > 0 && (
              <button
                type="submit"
                className="text-blue-600 underline font-bold ml-4"
              >
                salvar
              </button>
            )}
          </div>
        </form>
      )}
    </>
  )
}