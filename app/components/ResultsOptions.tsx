import { useDispatch } from 'react-redux'

import { setResults } from '@/app/store/reducers/payments'

export default function ResultsOptions() {
  const dispatch = useDispatch()

  const handleShowCalculation = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setResults({ showCalculation: e.target.checked }))
  }

  const handleShow10Percent = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setResults({ show10Percent: e.target.checked }))
  }

  return (
    <div>
      <div>
        <input
          type="checkbox"
          onChange={handleShow10Percent}
        />

        <label
          className="ml-2"
        >
          incluir 10% ┻━┻ ヘ╰( •̀ε•́ ╰)
        </label>
      </div>

      <div>
        <input
          type="checkbox"
          onChange={handleShowCalculation}
        />

        <label
          className="ml-2"
        >
          exibir cálculos ¯\_(ツ)_/¯
        </label>
      </div>
    </div>
  )
}