import { useSelector, useDispatch } from 'react-redux'
import { getPayersColors } from '@/app/utils'

import SavePayerForm from '@/app/components/SavePayerForm'

import { setStagingPayer, clearStagingPayer } from '@/app/store/reducers/payers'
import type { RootState } from '@/app/store'

export default function PayersSection() {
  const payersList = useSelector((state: RootState) => state.payers.list)
  const dispatch = useDispatch()

  const editPayer = (payerId: number) => {
    dispatch(clearStagingPayer())

    const payer = payersList.find(payer => payer.id === payerId)
    dispatch(setStagingPayer(payer))
  }

  return (
    <div
      className="w-fit min-w-full"
    >
      <h2
        className="mt-4 mb-4 font-bold"
      >
        pagantes:
      </h2>

      <div
        className="flex"
      >
        {payersList.map((payer, idx) => (
          <div
            key={'payer_' + payer.id}
            className={`mr-2 cursor-pointer text-gray-900 rounded py-1 px-2 text-xs font-bold last-of-type:mr-0 ${getPayersColors()[idx]}`}
            onClick={() => editPayer(payer.id)}
          >
            {payer.name}
          </div>
        ))}
      </div>

      <SavePayerForm />
    </div>
  )
}
