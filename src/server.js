import app, { markShuttingDown } from './app.js';
import config from './config.js';
import logger from './logger.js';

const server = app.listen(config.port, () => {
  logger.info({ port: config.port, pid: process.pid }, 'servidor iniciado');
});

function shutdown(signal) {
  logger.info({ signal }, 'sinal recebido, iniciando desligamento gracioso');
  markShuttingDown();

  // Para de aceitar conexoes novas e espera as que estao abertas terminarem
  server.close(() => {
    logger.info('conexoes encerradas, saindo');
    process.exit(0);
  });

  // Se alguma conexao travar, nao fica pendurado pra sempre
  setTimeout(() => {
    logger.error({ timeoutMs: config.shutdownTimeoutMs }, 'timeout no desligamento, forcando saida');
    process.exit(1);
  }, config.shutdownTimeoutMs).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
