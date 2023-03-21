export default function CopyItemsButton() {
  const copyItems = async () => {
    try {
      const wrappers: NodeListOf<HTMLElement> = document.querySelectorAll('.item-text-wrapper')
      if (!wrappers.length) return

      const content = Array.from(wrappers).map(wrapper => wrapper.innerText)

      await navigator.clipboard.writeText(content.join('\n'))
    } catch(err) {
      console.error('failed to copy', err)
    }
  }

  return (
    <button
      className="block"
      onClick={() => copyItems()}
    >
      copiar itens
    </button>
  )
}