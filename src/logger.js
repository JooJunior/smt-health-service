import pino from 'pino';
import config from './config.js';

// Log vai pro stdout em JSON. Quem decide onde guardar e o ambiente (Docker, Cloud, etc).
const logger = pino({
  level: config.logLevel,
  base: { service: config.serviceName, version: config.appVersion },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
