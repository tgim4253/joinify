import prisma from "../prisma.ts";
import { maskString } from "../utils/mask.ts";
import { z } from "zod";

/**
 * Fetch all events from the database.
 * @param isAdmin - If true, fetch all events; otherwise fetch only public events.
 */
export async function fetchEvents(isAdmin: boolean) {
    const events = await prisma.event.findMany({
        where: isAdmin ? {} : { isPublic: true },
        orderBy: { createdAt: 'desc' },
    });
    return events;
}

/**
 * Fetch event from the database.
 * @param id - target event id
 * @param isAdmin - If true, fetch all events; otherwise fetch only public events.
 */
export async function fetchEvent(id: bigint, isAdmin: boolean = false) {
    const event = await prisma.event.findUnique({
        where: {
            id,
            ...(isAdmin ? {} : { isPublic: true }),
        },
        include: { fields: true, members: true }
    });
    if (!event) {
        throw new Error('Event not found');
    }
    const fields = event.fields.filter((f) => !f.isDeleted && (isAdmin || f.isPublic));
    type MemberData = { [key: string]: any };

    const members = event.members.map((m) => ({
        ...m,
        data: {
            ...m.data as MemberData,
        }
    }))
    if (!isAdmin) {
        const sensitiveMap = new Map<
            string,
            { maskFrom: number | null; maskTo: number | null }
        >();

        // collect sensitive field
        fields.forEach((f) => {
            if (f.isSensitive) {
                sensitiveMap.set(f.fieldKey, {
                    maskFrom: f.maskFrom ?? 0,
                    maskTo: f.maskTo ?? 0,
                });
            }
        });
        // iterate members and mask in-place
        for (const m of members) {
            for (const [key, v] of sensitiveMap) {
                const raw = m.data[key];
                if (typeof raw === "string") {
                    m.data[key] = maskString(raw, v.maskFrom ?? 0, v.maskTo ?? 0);
                }
            }
        }
    }
    return {
        ...event,
        members,
        fields,
    };
}

const EventFormSchema = z.object({
    name: z.string().min(1, "name is required"),
    isPublic: z.boolean(),
    description: z.string().optional(),
    location: z.string().optional(),
    startAt: z.string().optional().refine(v => !v || !isNaN(Date.parse(v)), {
        message: "startAt must be a valid ISO date string",
    }),
    endAt: z.string().optional().refine(v => !v || !isNaN(Date.parse(v)), {
        message: "startAt must be a valid ISO date string",
    }),
    contactName: z.string().optional(),
    contactPhone: z.string().optional(),
    bannerImageUrl: z.string().url().optional(), // URL 형식 검증
});

/**
 * update event to the database
 * @param id - target event id
 * @param body - body
 */
export async function updateEventService(id: bigint, body: Express.EventForm) {
    const parsed = EventFormSchema.safeParse(body);
    if (!parsed.success) {
        throw new Error(`Validation failed: ${parsed.error.message}`);
    }
    const event = await prisma.event.update({
        where: { id },
        data: parsed.data,
    });
    return event;
}


