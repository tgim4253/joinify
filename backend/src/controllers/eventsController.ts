import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma.ts';
import { logAction } from '../utils/logger.ts';

export async function listEvents(req: Request, res: Response, next: NextFunction) {
    try {
        // const isAdmin = req.user?.role === 'admin';
        const events = await prisma.event.findMany({
            where: true ? {} : { isPublic: true },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(events);
    } catch (err) {
        next(err);
    }
}

export async function createEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const event = await prisma.event.create({
            data: req.body
        });

        await logAction(23, `CREATE_EVENT: ${req.body.name}`); 

        res.status(201).json(event);
    } catch (err) {
        next(err);
    }
}