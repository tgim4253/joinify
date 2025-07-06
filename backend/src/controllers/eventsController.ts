import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma.ts';
import { logAction } from '../utils/logger.ts';
import { serializeBigInt } from '../utils/serializeBigInt.ts';
import { fetchEvent, fetchEvents, updateEventService } from '../services/eventService.ts';
import { csvParser } from '../services/fileService.ts';
import { fetchFields } from '../services/fieldService.ts';


export async function getEventsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const isAdmin = req.user?.isAdmin ?? false;
        if (!isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const events = await fetchEvents(false);
        res.json(serializeBigInt(events));
    } catch (err) {
        next(err);
    }
}

export async function getEvents(req: Request, res: Response, next: NextFunction) {
    try {
        const events = await fetchEvents(false);
        res.json(serializeBigInt(events));
    } catch (err) {
        next(err);
    }
}

export async function createEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const event = await prisma.event.create({
            data: req.body
        });

        await logAction(req.user?.userId, `CREATE_EVENT: ${req.body.name}`);

        res.status(201).json(event);
    } catch (err) {
        next(err);
    }
}

export async function getEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const eventId = BigInt(req.params.id);
        const event = await fetchEvent(eventId, false);

        res.json(serializeBigInt(event));
    } catch (err) {
        next(err);
    }
}

export async function getEventAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const eventId = BigInt(req.params.id);
        const event = await fetchEvent(eventId, false);

        res.json(serializeBigInt(event));
    } catch (err) {
        next(err);
    }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const eventId = BigInt(req.params.id);
        const event = await updateEventService(eventId, req.body);
        await logAction(req.user?.userId, `UPDATE_EVENT: ${req.body.name}`);
        res.json(serializeBigInt(event));
    } catch (err) {
        next(err);
    }
}

export async function uploadCsv(req: Request, res: Response, next: NextFunction) {
    try {
        if(!req.file || !req.file.buffer) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const members = await csvParser(req.file.buffer);
        let data: string[] = [];
        let oldFields = await fetchFields();

        if(members.length > 0)
            data = Object.keys(members[0]);
        res.status(200).json({
            data,
            members,
            oldFields: serializeBigInt(oldFields)
        })
    } catch (err) {
        next(err);
    }
}