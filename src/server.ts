#!/usr/bin/env node
import express from 'express';
import { PORT, STORAGE_ROOT } from './config';
import { ensureDir } from './utils/storage';
import { createManifestRouter } from './routes/manifest';
import { createEventRouter, EventRecord } from './routes/events';

const app = express();

app.use(express.json({ limit: '100mb' }));

// CORS（拡張は Node から呼ぶため不要だが、念のため有効化）
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    return next();
});

const events: EventRecord[] = [];

app.use('/manifest', createManifestRouter());
app.use('/event', createEventRouter(events));

// 監査用
app.get('/_events', (_req, res) => {
    res.json(events);
});

app.listen(PORT, async () => {
    await ensureDir(STORAGE_ROOT);
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('Manifest: GET /manifest?student=alice&exercise=demo');
    console.log('Events:   GET /_events');
});
