export default function EditPayerForm() {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <form>
      <div>
        <label>name:</label>
      </div>

      <div>
        <input/>
      </div>

      <div>
        <button>
          salvar
        </button>

        <button
          onClick={handleCancel}
        >
          cancelar
        </button>
      </div>
    </form>
  )
}