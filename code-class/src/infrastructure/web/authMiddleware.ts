import { NextFunction, Request, Response  } from "express";
import { AuthApplication } from "../../application/AuthAplications";

export function authenticateToken(request: Request, response: Response, 
    next:NextFunction):void {
    
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        response.status(401).json({message: 'Required Token'});
        return;
    }
    try {
        const payload = AuthApplication.verifyToken(token);
        (request as any).user = payload;
        next();
    } catch (error) {
        response.status(403).json({message: 'Invalid Token or Expired'})
        return;
    }
}