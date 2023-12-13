import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { persistStagingItem, setStagingItem } from '@/app/store/reducers/items'
import { reset as resetItems } from '@/app/store/reducers/items'
import { reset as resetPayments, addPayment } from '@/app/store/reducers/payments'

import type { RootState } from '@/app/store'

export default function UploadReceiptImage() {
  const dispatch = useDispatch()
  const payersList = useSelector((state: RootState) => state.payers.list)

  const [files, setFiles] = useState<FileList | null>(null)
  const [isFetching, setFetching] = useState(false)

  const fetchData = async (dataUrl: string) => {
    setFetching(true)
    dispatch(resetItems())
    dispatch(resetPayments())

    const url = 'https://api.openai.com/v1/chat/completions'
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    }

    const data = {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `answer it with no escape characters. list the items on this restaurant bill receipt, format as json compressed in one line, set the items as an array of objects including "description" and "price".`
            },
            {
              type: 'image_url',
              image_url: { url: dataUrl }
            }
          ]
        }
      ],
      max_tokens: 2000
    }

    try {
      const response: any = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      })

      const responseJson: any = await response.json()
      const result = JSON.parse(responseJson.choices[0].message.content)

      const currentId = Date.now()

      result.items.forEach((item: any, idx: number) => {
        if (item.price === 0) return

        const id = currentId + idx

        const descriptionMaxLength = 16

        const title = item.description.length > descriptionMaxLength
          ? item.description.substring(0, descriptionMaxLength - 3) + '...'
          : item.description

        dispatch(setStagingItem({
          id,
          price: item.price,
          title,
          isCreating: true
        }))

        payersList.forEach(payer => {
          dispatch(addPayment({
            payerId: payer.id,
            itemId: id,
            paid: false
          }))
        })

        dispatch(persistStagingItem())
      })
      setFetching(false)
    } catch(err) {
      console.error(err)
    }
  }

  const uploadImage = () => {
    if (!files) return

    const imageFile = files[0]
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img: HTMLImageElement = document.createElement('img')

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const imgSize = 640

        const newWidth = img.width >= img.height
          ? imgSize
          : (imgSize * img.width) / img.height

        const newHeight = img.width >= img.height
          ? (imgSize * img.height) / img.width
          : imgSize

        canvas.width = newWidth
        canvas.height = newHeight

        ctx?.drawImage(img, 0, 0, newWidth, newHeight)

        const dataUrl = canvas.toDataURL(imageFile.type)

        img.remove()
        canvas.remove()

        fetchData(dataUrl)
      }

      if (ev.target?.result) img.src = ev.target?.result.toString()
    }

    reader.readAsDataURL(imageFile)
  }

  return (
    <div
      className="w-full p-2 bg-slate-100"
    >
      <div
        className="mb-4"
      >
        <h1
          className="text-center font-bold"
        >
          enviar imagem
        </h1>
      </div>

      <div
        className="flex justify-between"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(ev) => {
            setFiles(ev.target.files)
          }}
        />

        {files && !isFetching && (
          <button
            type="button"
            onClick={() => uploadImage()}
            className="underline font-bold"
          >
            enviar
          </button>
        )}

        {files && isFetching && (
          <p
            className="font-bold"
          >
            carregando...
          </p>
        )}
      </div>
    </div>
  )
}
