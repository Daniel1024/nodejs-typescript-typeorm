import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { UserEntity } from '../entities';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).json({ message: 'Username and Password are required!' });
    }

    const userRepository = getRepository(UserEntity);
    let user: UserEntity;

    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (e) {
      return res.status(400).json({ message: 'Username and Password incorrect' });
    }

    res.send(user);
  }
}
