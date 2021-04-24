import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { UserEntity } from "../entities";
import { validate } from 'class-validator';

export default class UserController {
  static async getAll(req: Request, res: Response) {
    const userRepository = getRepository(UserEntity);
    const users = await userRepository.find();
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).json({ message: 'Not result' });
    }
  }

  static async getById(req: Request, res: Response) {
    const userRepository = getRepository(UserEntity);
    const { id } = req.body;
    try {
      const user = await userRepository.findOneOrFail(id);
      res.send(user);
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  }

  static async newUser(req: Request, res: Response) {
    const userRepository = getRepository(UserEntity);
    const { username, password, role } = req.body;
    const user = userRepository.create({ username, password, role });

    // Validate
    const errors = await validate(user, { validationError: { value: false, target: false } });
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const newUser = await userRepository.save(user);

      res.send({ message: 'User created', user: newUser });
    } catch (e) {
      return res.status(409).json({ message: 'Username already exist' });
    }

  }

  static async editUser(req: Request, res: Response) {
    const userRepository = getRepository(UserEntity);
    let user: UserEntity;
    const { id } = req.params;
    const { username, role } = req.body;

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username;
    user.role = role;

    const errors = await validate(user, { validationError: { value: false, target: false } });
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const newUser = await userRepository.save(user);

      res.status(201).json({ message: 'User update', user: newUser });
    } catch (e) {
      return res.status(409).json({ message: 'Username already in use' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const userRepository = getRepository(UserEntity);
    const { id } = req.params;
    try {
      await userRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: 'User not found ' });
    }

    await userRepository.delete(id);
    res.status(201).json({ message: 'User deleted' });
  }

}
