import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
    userId: string;
    email: string;
    role: "admin" | "viewr";
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    // jwt 토큰 확인
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // jwt 토큰 validation
    const token = authHeader.split(" ")[1];
    try {
        const secreat = process.env.JWT_SECRET as string;
        const payload = jwt.verify(token, secreat) as AuthPayload;
        
        // user 정보 req에 저장
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
