import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { UserEntity } from '../entities';

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = res.locals.jwtPayload;
    const userRepo = getRepository(UserEntity);
    let user: UserEntity;

    try {
      user = await userRepo.findOneOrFail(userId);
    } catch (e) {
      return res.status(401).json({ message: 'Not Authorized' });
    }

    // Check
    const { role } = user;
    if (roles.includes(role)) {
      next();
    } else {
      res.status(401).json({ message: 'Not Authorized' });
    }
  }
}
