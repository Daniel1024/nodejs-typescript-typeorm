import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { jwt } from '../config'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  let jwtPayload: any;
  try {
    const token: string = req.headers.authorization.split(' ')[1];
    jwtPayload = verify(token, jwt.secret);
  } catch ({ message }) {
    return res.status(401).json({ message: 'Not Authorized', error: message });
  }

  res.locals.jwtPayload = jwtPayload;

  const { userId, username } = jwtPayload;

  const newToken = sign({ userId, username }, jwt.secret, { expiresIn: '1h' });
  res.setHeader('token', newToken);

  next();
}
