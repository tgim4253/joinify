import prisma from "../prisma.ts";

/**
 * Fetch all fields from the database.
 */
export async function fetchFields() {
    const fields = await prisma.eventField.findMany();
    return fields;
}