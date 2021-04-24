import { Router } from 'express';
import { UserController } from '../controller/UserController';

const router = Router();
const controller = new UserController();

// Get all users
router.get('/', controller.getAll);

// Get user by id
router.get('/:id', controller.getById);

// Create a new user
router.post('/', controller.newUser);

// Edit user
router.patch('/:id', controller.editUser);

// Delete
router.delete('/:id', controller.deleteUser);

export default router;
