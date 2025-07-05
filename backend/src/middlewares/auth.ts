import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
    userId: string;
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

        req.user = verifyToken(token);
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}


export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== "admin") {
        req.user.isAdmin = true;
        return res.status(403).json({ message: "Forbidden" });
    }
    return next();
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = extractToken(req.header("Authorization"));
        if (token) {
            req.user = verifyToken(token);
        } else {
            req.user = undefined;
        }
    } catch {
        req.user = undefined;
    }
    return next();
}
