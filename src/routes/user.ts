import { Router } from 'express';
import UserController from '../controller/UserController';

const router = Router();

// Get all users
router.get('/', UserController.getAll);

// Get user by id
router.get('/:id', UserController.getById);

// Create a new user
router.post('/', UserController.newUser);

// Edit user
router.patch('/:id', UserController.editUser);

// Delete
router.delete('/:id', UserController.deleteUser);

export default router;
