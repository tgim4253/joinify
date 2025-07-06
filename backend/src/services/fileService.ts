import csv from "csv-parser"
import { Readable } from 'stream';

export async function csvParser(bufferData: Buffer | string | Array<Buffer | string>): Promise<Record<string, string>[]> {
    const results: Record<string, string>[] = [];

    //메모리 버퍼 => 스트림 형태
    const stream = Readable.from(bufferData);

    return new Promise((resolve, reject) => {
        stream
            .pipe(csv()) // csv-parser(스트림형)
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log('Parsed CSV (in-memory):', results);
                resolve(results);
            })
            .on('error', (err) => {
                console.error(err);
                reject(err);
            })
    });
}