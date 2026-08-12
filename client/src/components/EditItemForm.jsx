import { useState } from 'react'

function EditItemForm({ item, onItemUpdated }) {
  const [formData, setFormData] = useState({
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    price: item.price,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          quantity: Number(formData.quantity) || 0,
          price: Number(formData.price) || 0,
        }),
      })

      if (!res.ok) throw new Error('Failed to update item')

      const updatedItem = await res.json()
      onItemUpdated(updatedItem)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <h2>Edit Item</h2>
      {error && <p className="form-error">{error}</p>}
      <div className="form-column">
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

export default EditItemForm