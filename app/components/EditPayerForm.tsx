import { useDispatch, useSelector } from 'react-redux'

import { clearStagingPayer, setStagingPayer, persistStagingPayer } from '@/app/store/reducers/payers'
import type { RootState } from '@/app/store'

export default function EditPayerForm() {
  const currentPlayer = useSelector((state: RootState) => state.payers.stagingPayer)
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
      {currentPlayer && (
        <form
          className='mt-4'
          onSubmit={handleSubmit}
        >
          <div>
            <label>name:</label>

            <input
              name='name'
              className='ml-2'
              onChange={handleInputChange}
              value={currentPlayer.name}
              autoFocus
            />
          </div>

          <div>
            <button>
              salvar
            </button>

            <button
              className='ml-4'
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