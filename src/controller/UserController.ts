import { getRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import { UserEntity } from "../entities";
import { validate } from 'class-validator';

export class UserController {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = getRepository(UserEntity);
  }

  async getAll(req: Request, res: Response) {
    const users = await this.userRepository.find();
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).json({ message: 'Not result' });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.body;
    try {
      const user = await this.userRepository.findOneOrFail(id);
      res.send(user);
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  }

  async newUser(req: Request, res: Response) {
    const { username, password, role } = req.body;
    const user = this.userRepository.create({ username, password, role });

    // Validate
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // TODO: hash password

    try {
      const newUser = await this.userRepository.save(user);

      res.send({ message: 'User created', user: newUser });
    } catch (e) {
      return res.status(409).json({ message: 'Username already exist' });
    }

  }

  async editUser(req: Request, res: Response) {
    let user: UserEntity;
    const { id } = req.params;
    const { username, role } = req.body;

    try {
      user = await this.userRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username;
    user.role = role;

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const newUser = await this.userRepository.save(user);

      res.status(201).json({ message: 'User update', user: newUser });
    } catch (e) {
      return res.status(409).json({ message: 'Username already in use' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      // Delete or Remove
      await this.userRepository.delete(id);
      res.status(201).json({ message: 'User deleted' });
    } catch (e) {
      return res.status(404).json({ message: 'User not found ' });
    }
  }

}
