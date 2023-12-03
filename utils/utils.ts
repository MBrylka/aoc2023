import { rejects } from "assert";
import * as fs from "fs";

export function loadLinesFromFile(filepath:string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading file: ${err.message}`);
            } else {
                const lines = data.split('\n');
                resolve(lines);
            }
        });
    });
}