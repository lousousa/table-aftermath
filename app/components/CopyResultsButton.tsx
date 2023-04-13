import { useState } from 'react'

export default function CopyResultsButton() {
  const [copyCreated, setCopyCreated] = useState(false)

  const copyResults = async () => {
    try {
      const resultsContentElement = document.getElementById('results_content')
      if (!resultsContentElement) return

      let text: string | string[] = resultsContentElement.innerText
      text = text.split('\n\n')
      const total = text.pop()
      text = text.join('\n')
      text = `${text}\n\n${total}`

      await navigator.clipboard.writeText(text)

      setCopyCreated(true)

      window.setTimeout(() => setCopyCreated(false), 1500)
    } catch(err) {
      console.error('failed to copy', err)
    }
  }

  return (
    <div>
      <button
        className="underline"
        onClick={() => copyResults()}
      >
        copy results
      </button>

      {copyCreated && (
        <span
          className="text-blue-300 font-bold ml-4"
        >
          copied!
        </span>
      )}
    </div>
  )
}