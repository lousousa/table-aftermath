import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addItems } from '@/app/store/reducers/items'
import { addPayments } from '@/app/store/reducers/payments'
import type { RootState } from '@/app/store'
import type { Item, Payment } from '@/app/types'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024

type ReceiptExtraction = {
  receiptDetected: boolean
  items: Array<{
    title: string
    price: number
  }>
  total: number | null
  currency: string | null
  sumMatchesTotal: boolean | null
  warning: string | null
}

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()

  reader.onload = () => {
    if (typeof reader.result === 'string') resolve(reader.result)
    else reject(new Error('Não foi possível ler a imagem.'))
  }

  reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'))
  reader.readAsDataURL(file)
})

export default function ReceiptUploader() {
  const payersList = useSelector((state: RootState) => state.payers.list)
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const importItems = (receiptItems: ReceiptExtraction['items']) => {
    const now = Date.now()
    const items: Item[] = receiptItems.map((item, index) => ({
      id: now + index,
      title: item.title,
      price: item.price,
    }))

    const payments: Payment[] = items.flatMap((item) => (
      payersList.map((payer) => ({
        payerId: payer.id,
        itemId: item.id,
        paid: false,
      }))
    ))

    dispatch(addItems(items))
    dispatch(addPayments(payments))
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    setError(null)
    setMessage(null)

    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Envie uma imagem nos formatos JPG, PNG ou WEBP.')
      resetInput()
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError('A imagem precisa ter no máximo 8 MB.')
      resetInput()
      return
    }

    setIsLoading(true)

    try {
      const image = await readFileAsDataUrl(file)
      const response = await fetch('/api/receipts/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error ?? 'Não foi possível processar a imagem.')
      }

      const extraction = data as ReceiptExtraction

      if (!extraction.receiptDetected || !extraction.items.length) {
        setError(extraction.warning ?? 'Não foi possível identificar uma comanda ou nota na imagem.')
        return
      }

      importItems(extraction.items)

      const totalWarning = extraction.sumMatchesTotal === false
        ? ' A soma dos itens não bate com o total detectado, confira os valores.'
        : ''

      setMessage(`${extraction.items.length} itens importados da imagem.${totalWarning}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível processar a imagem.')
    } finally {
      setIsLoading(false)
      resetInput()
    }
  }

  return (
    <section className="mt-4 rounded border border-gray-300 bg-gray-50 p-4">
      <h2 className="font-bold">importar itens por foto</h2>
      <p className="mt-1 text-sm text-gray-600">
        Envie uma foto da comanda/nota para tentar preencher os itens automaticamente.
      </p>

      <label className="mt-3 block">
        <span className="sr-only">foto da comanda ou nota</span>
        <input
          ref={fileInputRef}
          accept={[...ACCEPTED_IMAGE_EXTENSIONS, ...ACCEPTED_IMAGE_TYPES].join(',')}
          className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-bold file:text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
          onChange={handleFileChange}
          type="file"
        />
      </label>

      {isLoading && (
        <p className="mt-2 text-sm text-gray-600">lendo a imagem com IA...</p>
      )}

      {message && (
        <p className="mt-2 rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}
