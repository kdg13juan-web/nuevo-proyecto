import {Router} from 'express'
import {pool} from '../db.js'

const router = Router()
router.get('/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
})

router.get('/users/:id', async (req, res) => {
    const {id} = req.params
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])

    if (result.rows.length === 0) {
        return res.status(404).json({message: 'User not found'})
    }
    res.json(result.rows)
})

router.post('/users', async (req, res) => {
    const {name, email, password_hash} = req.body
    const result = await pool.query('INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3) RETURNING *', [data.name, data.email, data.password_hash])
    res.json(result.rows[0])
})

router.delete('/users/:id', async (req, res) => {
    const {id} = req.params
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
        return res.status(404).json({message: 'User not found'})
    }
    res.json(result.rows[0])
})

router.put('/users/:id', async (req, res) => {
    const {id} = req.params
    const {name, email, password_hash} = req.body
    const result = await pool.query('UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING *', [name, email, password_hash, id])
    res.json(result.rows[0])
})

export default router
