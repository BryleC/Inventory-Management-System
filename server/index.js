const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

app.post('/api/items', async (req, res) => {
  const { name, sku, quantity, price } = req.body

  if (!name || !sku) {
    return res.status(400).json({ error: 'Name and SKU are required' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO items (name, sku, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, sku, quantity || 0, price || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add item' })
  }
})
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.json({ message: 'Item deleted', item: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete item' })
  }
})
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params
  const { name, sku, quantity, price } = req.body

  if (!name || !sku) {
    return res.status(400).json({ error: 'Name and SKU are required' })
  }

  try {
    const result = await pool.query(
      'UPDATE items SET name = $1, sku = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *',
      [name, sku, quantity || 0, price || 0, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update item' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})