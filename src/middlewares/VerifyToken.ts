import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  let secret = process.env.JWT_SECRET || "lb321";
  const token = req.headers.authorization;
  // console.log(req.body)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }
  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    (req as any).body.userID = decoded._id;
    next();
  });
};