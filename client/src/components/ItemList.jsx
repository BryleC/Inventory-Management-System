import { useState, useEffect } from 'react'
import AddItemForm from './AddItemForm'
import EditItemForm from './EditItemForm'
import Modal from './Modal'

function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then((res) => res.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleItemAdded = (newItem) => {
    setItems((prev) => [...prev, newItem])
    setIsAddModalOpen(false)
  }

  const handleItemUpdated = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    )
    setEditingItem(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return

    try {
      const res = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete item')

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="item-list">
      <h1>Inventory</h1>

      <button className="add-item-btn" onClick={() => setIsAddModalOpen(true)}>
        + Add Item
      </button>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddItemForm onItemAdded={handleItemAdded} />
      </Modal>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)}>
        {editingItem && (
          <EditItemForm item={editingItem} onItemUpdated={handleItemUpdated} />
        )}
      </Modal>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.quantity}</td>
              <td>${Number(item.price).toFixed(2)}</td>
              <td>
                <button className="edit-btn" onClick={() => setEditingItem(item)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ItemList