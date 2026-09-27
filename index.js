import { createServer } from 'node:http';
import { createRatchet } from '@getratchet/sdk';

const apiKey = process.env.RATCHET_WORKER_KEY;
if (!apiKey) throw new Error('Configure RATCHET_WORKER_KEY');
if (!process.env.RATCHET_WORKER_ID || process.env.RATCHET_WORKER_ID.length < 8) throw new Error('Configure a stable RATCHET_WORKER_ID (at least 8 characters)');
const ratchet = createRatchet({ apiKey, baseUrl: process.env.RATCHET_BASE_URL || 'https://getratchet.waelfz.com' });
const worker = ratchet.worker;
// Stable per replica: avoid consuming a new registration on every restart.
worker.workerId = process.env.RATCHET_WORKER_ID;
// EXAMPLE ONLY: replace this with your own handler and matching key allowlist.
worker.registerTool({ name: 'getratchet_echo', version: '1', handler: async input => input });
const server = createServer((request, response) => {
  if (request.url !== '/health') { response.writeHead(404).end(); return; }
  response.writeHead(200, { 'content-type': 'application/json' }).end('{"ok":true}');
});
server.listen(Number(process.env.PORT) || 8080, '0.0.0.0');
for (const signal of ['SIGTERM', 'SIGINT']) process.once(signal, async () => {
  server.close(); await worker.stop();
});
try {
  await worker.start({ concurrency: 1, pollIntervalMs: 1000, onError: () => console.warn(JSON.stringify({ event: 'worker.request_failed' })) });
} catch { console.error(JSON.stringify({ event: 'worker.start_failed' })); process.exitCode = 1; }
finally { server.close(); }
