import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express-serve-static-core";
import jwt from "jsonwebtoken";

export interface AuthPayload {
    userId: number;
    email: string;
    role: "admin" | "viewer";
}

function extractToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) return null;

    return token;
}

function verifyToken(token: string): AuthPayload {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set");

    return jwt.verify(token, secret) as AuthPayload;
}


export function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = extractToken(req.header("Authorization"));
        if (!token) throw new Error("Token missing");

        // req.user = verifyToken(token);
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}


export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    return next();
}

export const optionalAuth: RequestHandler = (req, res, next) => {

    return next();
}
