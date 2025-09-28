import { existsSync } from 'fs';
import path from 'path';

const DEFAULT_PORT = 8787;
const rawPort = process.env.PORT;
const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : DEFAULT_PORT;

function resolveTemplateRoot(): string {
    const packageTemplateRoot = path.resolve(__dirname, '../templates');
    const searchRoots = new Set<string>();
    
    // Add current working directory
    const cwd = process.cwd();
    if (cwd) {
        searchRoots.add(cwd);
    }
    
    // Add npm project root (where package.json is located)
    const npmProjectRoot = process.env.npm_config_local_prefix || process.env.PWD || process.env.INIT_CWD;
    if (npmProjectRoot) {
        searchRoots.add(path.resolve(npmProjectRoot));
    }
    
    // Add parent directories of the current working directory
    let current = cwd;
    while (current && path.dirname(current) !== current) {
        searchRoots.add(current);
        current = path.dirname(current);
    }

    const visited = new Set<string>();

    for (const root of searchRoots) {
        let searchPath = path.resolve(root);
        for (;;) {
            if (visited.has(searchPath)) {
                break;
            }
            visited.add(searchPath);

            const candidate = path.join(searchPath, 'templates');
            if (existsSync(candidate)) {
                console.log(`Using templates from: ${candidate}`);
                return candidate;
            }

            const parent = path.dirname(searchPath);
            if (parent === searchPath) {
                break;
            }
            searchPath = parent;
        }
    }

    console.log(`Using default templates from: ${packageTemplateRoot}`);
    return packageTemplateRoot;
}

const defaultTemplateRoot = resolveTemplateRoot();

export const PORT = Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;
export const STORAGE_ROOT = path.resolve(process.env.STORAGE_ROOT ?? './storage');
export const TEMPLATE_ROOT = process.env.TEMPLATE_ROOT
    ? path.resolve(process.env.TEMPLATE_ROOT)
    : defaultTemplateRoot;
