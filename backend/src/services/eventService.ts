import prisma from "../prisma.ts";
import { maskString } from "../utils/mask.ts";

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
    const fields = event.fields.filter((f) => isAdmin || f.isPublic);
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
