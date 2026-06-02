import {Router} from 'express'
import { getAllUsers } from '../controllers/users.controllers.js'
import { getUserById } from '../controllers/users.controllers.js'
import { createUser } from '../controllers/users.controllers.js'
import { deleteUser } from '../controllers/users.controllers.js'
import { updateUser } from '../controllers/users.controllers.js'

const router = Router()

router.get('/users', getAllUsers)

router.get('/users/:id', getUserById)

router.post('/users', createUser)

router.delete('/users/:id', deleteUser)

router.put('/users/:id', updateUser)

export default router
