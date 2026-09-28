// Tarefa administrativa (fator XII): roda uma vez, com o mesmo codigo e config
// do app, pra validar o ambiente antes de subir. Ex: npm run admin:check-config
import config from '../src/config.js';

const erros = [];
const niveis = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
  erros.push(`PORT invalida: ${process.env.PORT}`);
}
if (!niveis.includes(config.logLevel)) {
  erros.push(`LOG_LEVEL invalido: ${config.logLevel} (use ${niveis.join(', ')})`);
}

console.log('config carregada:', config);

if (erros.length > 0) {
  console.error('problemas encontrados:\n- ' + erros.join('\n- '));
  process.exit(1);
}
console.log('config ok');
