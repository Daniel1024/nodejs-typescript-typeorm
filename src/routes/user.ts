import { Router } from 'express';
import UserController from '../controller/UserController';
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/role';

const router = Router();
const handlers = [checkJwt, checkRole(['admin'])];

// Get all users
router.get('/', handlers, UserController.getAll);

// Get user by id
router.get('/:id', handlers, UserController.getById);

// Create a new user
router.post('/', handlers, UserController.newUser);

// Edit user
router.patch('/:id', handlers, UserController.editUser);

// Delete
router.delete('/:id', handlers, UserController.deleteUser);

export default router;
