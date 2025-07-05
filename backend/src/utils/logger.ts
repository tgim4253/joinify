import { NextFunction } from "express";
import prisma from "../prisma.ts";

export async function logAction(userId: string | undefined, action: string) {
    if (!userId) return; // 유저 없는 경우 로깅 생략
    const payload = JSON.stringify(action);
    try {
        await prisma.log.create({
            data: {
                userId: BigInt(userId),
                action,
                payload,
            },
        });
    } catch (error) {
        console.error('로그 기록 실패:', error); // 로깅 실패는 앱 중단 없이 처리
    }
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
