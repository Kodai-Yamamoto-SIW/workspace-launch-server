import path from 'path';

const DEFAULT_PORT = 8787;
const rawPort = process.env.PORT;
const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : DEFAULT_PORT;

const defaultTemplateRoot = path.resolve(__dirname, '../templates');

export const PORT = Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;
export const STORAGE_ROOT = path.resolve(process.env.STORAGE_ROOT ?? './storage');
export const TEMPLATE_ROOT = process.env.TEMPLATE_ROOT
    ? path.resolve(process.env.TEMPLATE_ROOT)
    : defaultTemplateRoot;
