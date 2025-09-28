import { existsSync } from 'fs';
import path from 'path';

const DEFAULT_PORT = 8787;
const rawPort = process.env.PORT;
const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : DEFAULT_PORT;

function resolveTemplateRoot(): string {
    const packageTemplateRoot = path.resolve(__dirname, '../templates');
    const searchRoots = new Set<string>();
    const cwd = process.cwd();
    if (cwd) {
        searchRoots.add(cwd);
    }
    const npmLocalPrefix = process.env.npm_config_local_prefix;
    if (npmLocalPrefix) {
        searchRoots.add(path.resolve(npmLocalPrefix));
    }

    const visited = new Set<string>();

    for (const root of searchRoots) {
        let current = path.resolve(root);
        for (;;) {
            if (visited.has(current)) {
                break;
            }
            visited.add(current);

            const candidate = path.join(current, 'templates');
            if (existsSync(candidate)) {
                return candidate;
            }

            const parent = path.dirname(current);
            if (parent === current) {
                break;
            }
            current = parent;
        }
    }

    return packageTemplateRoot;
}

const defaultTemplateRoot = resolveTemplateRoot();

export const PORT = Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;
export const STORAGE_ROOT = path.resolve(process.env.STORAGE_ROOT ?? './storage');
export const TEMPLATE_ROOT = process.env.TEMPLATE_ROOT
    ? path.resolve(process.env.TEMPLATE_ROOT)
    : defaultTemplateRoot;
