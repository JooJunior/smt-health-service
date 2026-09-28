// Tarefa administrativa (fator XII): roda uma vez, com o mesmo codigo e config
// do app, pra validar o ambiente antes de subir. Ex: npm run admin:check-config
import config from '../src/config.js';

const erros = [];
const niveis = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];

// Olha o valor cru: no config.js um PORT invalido cairia no padrao 3000 sem avisar
const portaCrua = process.env.PORT;
if (portaCrua !== undefined && !/^\d+$/.test(portaCrua)) {
  erros.push(`PORT invalida: ${portaCrua}`);
} else if (config.port < 1 || config.port > 65535) {
  erros.push(`PORT fora do intervalo: ${config.port}`);
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
