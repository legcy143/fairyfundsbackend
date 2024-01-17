import jwt from 'jsonwebtoken';

export const GenrateJwtToken = (userPayload: any, expiresIn: string = '1h'): string => {
    const secretKey = process.env.JWT_SECRET || "lb321";
    const token = jwt.sign(userPayload, secretKey, { expiresIn });
    return token;
};