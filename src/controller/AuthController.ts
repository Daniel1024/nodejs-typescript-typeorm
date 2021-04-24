import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from '../entity/User';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).json({ message: 'Username and Password are required!' });
    }

    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (e) {
      return res.status(400).json({ message: 'Username and Password incorrect' });
    }

    res.send(user);
  }
}
