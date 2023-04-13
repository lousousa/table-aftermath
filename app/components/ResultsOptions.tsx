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
    <div
      className="mt-4"
    >
      <h2
        className="font-bold"
      >
        options:
      </h2>

      <div>
        <input
          id="10_percent_checkbox"
          type="checkbox"
          onChange={handleShow10Percent}
        />

        <label
          className="ml-2"
          htmlFor="10_percent_checkbox"
        >
          include <b>10%</b> ┻━┻ ヘ╰( •̀ε•́ ╰)
        </label>
      </div>

      <div>
        <input
          id="calculation_checkbox"
          type="checkbox"
          onChange={handleShowCalculation}
        />

        <label
          className="ml-2"
          htmlFor="calculation_checkbox"
        >
          show calculation ¯\_(ツ)_/¯
        </label>
      </div>
    </div>
  )
}