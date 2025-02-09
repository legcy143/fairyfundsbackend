import jwt from 'jsonwebtoken';

export const GenrateJwtToken = (userPayload: any, expiresIn: string = '1h'): string => {
    const secretKey = process.env.JWT_SECRET as string;
    return jwt.sign(userPayload, secretKey as jwt.Secret, { expiresIn : "24h" });
};