export default function AddItemForm() {
  const saveItem = (e: React.SyntheticEvent) => {
    e.preventDefault()
    console.log('save item')
  }

  return (
    <form
      onSubmit={saveItem}
    >
      <div>
        <label>preço:</label>
        <input />
      </div>

      <div>
        <label>título (opcional):</label>
        <input />
      </div>

      <div>
        <input type="checkbox"/>
        <label>todos pagam?</label>
      </div>

      <button>
        adicionar
      </button>
    </form>
  )
}