export function serializeBigInt(obj: any): any {
    if (obj instanceof Date) {
        return obj.toISOString();
    }


    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt);
    }

    if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        );
    }

    return obj;
}
