import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { UserEntity } from '../entities';
import { sign } from 'jsonwebtoken';
import { jwt } from '../config';

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
      return res.status(400).json({ message: 'Username or Password is incorrect' });
    }

    const checkPass = await user.checkPassword(password);

    // Check Password
    if (!checkPass) {
      return res.status(400).json({ message: 'Username or Password is incorrect' });
    }

    const token = sign({ userId: user.id, username: user.username }, jwt.secret, {
      expiresIn: '1h'
    });

    res.json({ message: 'OK', token });
  }
}
