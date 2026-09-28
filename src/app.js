import express from 'express';
import config from './config.js';
import logger from './logger.js';

const startedAt = Date.now();
let shuttingDown = false;

export function markShuttingDown() {
  shuttingDown = true;
}

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info({ method: req.method, path: req.path, status: res.statusCode, ms: Math.round(ms) }, 'request');
  });
  next();
});

app.get('/', (req, res) => {
  res.json({ service: config.serviceName, docs: 'GET /health' });
});

app.get('/health', (req, res) => {
  // Durante o desligamento responde 503 pro balanceador parar de mandar trafego
  if (shuttingDown) {
    return res.status(503).json({ status: 'shutting_down' });
  }
  res.json({
    status: 'ok',
    service: config.serviceName,
    version: config.appVersion,
    uptime_s: Math.round((Date.now() - startedAt) / 1000),
    pid: process.pid,
    timestamp: new Date().toISOString(),
  });
});

export default app;
