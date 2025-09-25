import fs from 'fs/promises';
import path from 'path';
import { STORAGE_ROOT } from '../config';

export interface UserMeta {
    student?: string;
    exercise?: string;
}

export function sanitize(value: unknown): string {
    return String(value ?? '').replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function userRoot({ student = 'unknown', exercise = 'default' }: UserMeta = {}): string {
    return path.join(STORAGE_ROOT, sanitize(student), sanitize(exercise));
}

export async function ensureDir(targetPath: string): Promise<void> {
    await fs.mkdir(targetPath, { recursive: true });
}

export function safeJoin(root: string, rel: string): string {
    const target = path.resolve(root, rel);
    const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
    if (!(target === root || target.startsWith(rootWithSep))) {
        throw new Error('path traversal detected');
    }
    return target;
}
