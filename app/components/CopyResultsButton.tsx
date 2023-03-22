export default function CopyResultsButton() {
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
    } catch(err) {
      console.error('failed to copy', err)
    }
  }

  return (
    <button
      className="block underline"
      onClick={() => copyResults()}
    >
      copiar resultados
    </button>
  )
}