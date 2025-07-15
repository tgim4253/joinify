import prisma from "../prisma.ts";

/**
 * Fetch all fields from the database.
 */
export async function fetchFields(eventId: bigint | null = null) {
    const fields = await prisma.eventField.findMany();
    if (eventId) {
        return fields.filter(field => field.eventId === eventId);
    }
    return fields;
}

export async function upsertFields(eventId: bigint, fields: Express.EventFieldData[]) {
    return await prisma.$transaction(
        fields.map((fieldData: any) =>
                prisma.eventField.upsert({
                    where: {
                        eventId_fieldKey: {
                            eventId: eventId,
                            fieldKey: fieldData.fieldKey,
                        },
                    },
                    update: { ...fieldData, eventId: eventId },
                    create: { ...fieldData, eventId: eventId },
                })
            )
    );
}