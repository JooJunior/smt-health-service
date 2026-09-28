// Toda configuracao vem do ambiente (fator III). Os valores padrao so existem
// pra rodar local sem precisar de .env.
const config = {
  port: Number(process.env.PORT) || 3000,
  serviceName: process.env.SERVICE_NAME || 'smt-health-service',
  appVersion: process.env.APP_VERSION || 'dev',
  logLevel: process.env.LOG_LEVEL || 'info',
  shutdownTimeoutMs: Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10000,
};

export default config;
