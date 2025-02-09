import jwt from 'jsonwebtoken';

export const GenrateJwtToken = (userPayload: any, expiresIn: string = '1h'): string => {
    const secretKey = process.env.JWT_SECRET || "lb321";
    return jwt.sign(userPayload, secretKey as jwt.Secret, { expiresIn : "24h" });
};