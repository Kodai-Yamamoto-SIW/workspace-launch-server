import express from 'express';
import { loadManifestForExercise } from '../utils/manifest';

function resolveExercise(raw: unknown): string {
    if (Array.isArray(raw)) {
        return resolveExercise(raw[0]);
    }
    const value = typeof raw === 'string' ? raw : undefined;
    return value && value.length > 0 ? value : 'unknown';
}

export function createManifestRouter(): express.Router {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const exercise = resolveExercise(req.query.exercise);
        try {
            const manifest = await loadManifestForExercise(exercise);
            res.json(manifest);
        } catch (error) {
            console.error('manifest error', error);
            res.status(500).json({ ok: false, error: String(error) });
        }
    });

    return router;
}
