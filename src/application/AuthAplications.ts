import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_SECRET || 'fallback-secret';;
console.log(JWT_KEY);

export class AuthApplication {

    static generateToken(payload: object): string {
        return jwt.sign(payload, JWT_KEY, { expiresIn: '12h' });
    }

    static verifyToken(token: string): any {
        return jwt.verify(token, JWT_KEY);
    }
}