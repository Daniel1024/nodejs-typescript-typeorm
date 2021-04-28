import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { UserEntity } from '../entities';
import { sign } from 'jsonwebtoken';
import { jwt } from '../config';
import { validate } from 'class-validator';

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

    const isWrongPassword = await user.isWrongPassword(password);

    // Check Password
    if (isWrongPassword) {
      return res.status(400).json({ message: 'Username or Password is incorrect' });
    }

    const token = sign({ userId: user.id, username: user.username }, jwt.secret, {
      expiresIn: '1h'
    });
    delete user.password;

    res.json({ message: 'OK', token, user });
  }

  static async changePassword(req: Request, res: Response) {
    const { userId } = res.locals.jwtPayload;
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      return res.status(400).json({ message: 'Old password and New password are required' });
    }

    const userRepo = getRepository(UserEntity);
    let user: UserEntity;

    try {
      user = await userRepo.findOneOrFail(userId);
    } catch (e) {
      return res.status(400).json({ message: 'Something goes wrong!' });
    }

    const isWrongPassword = await user.isWrongPassword(oldPassword);

    if (isWrongPassword) {
      return res.status(401).json({ message: 'Check your old password' });
    }

    user.password = newPassword;
    const errors = await validate(user, { validationError: { value: false, target: false } });

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    await userRepo.save(user);

    res.json({ message: 'Password change!' });
  }
}
