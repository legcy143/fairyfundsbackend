import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const AdminCheck = (req: Request, res: Response, next: NextFunction) => {
  let secret = process.env.JWT_SECRET || "lb321";
  const token = req.headers.authorization;
  // console.log(req.body)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }
  jwt.verify(token, secret, (err: any, decoded: any) => {
    console.log(decoded._id)
      if(decoded._id !== 566556655665){
        throw "invalid user id"
      }
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    (req as any).body.userID = decoded._id;
    next();
  });
};