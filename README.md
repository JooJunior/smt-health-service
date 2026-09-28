# smt-health-service

Serviço mínimo em Node.js + Express feito no Lab 4 de Arquitetura de Software 4 (Jala University). A ideia é ser o primeiro serviço do SMT (Sistema de Monitoramento de Tráfego, o Capstone da disciplina), já nascendo dentro do 12-Factor App. Por enquanto ele só tem o `/health`, mas a base (config, logs, desligamento, scripts) já está pronta pra receber os próximos endpoints.

- Linguagem: JavaScript (Node.js 24)
- Framework: Express 5
- Logs: pino (JSON no stdout)
- Licença: MIT

## Início rápido

Precisa de Node 24 (tem um `.nvmrc`, então `nvm use` resolve).

```bash
git clone https://github.com/JooJunior/smt-health-service.git
cd smt-health-service
npm ci
cp .env.example .env
npm run admin:check-config   # valida as variáveis antes de subir
npm start                    # ou ./scripts/start.sh
```

Verificar:

```bash
curl http://localhost:3000/health
# {"status":"ok","service":"smt-health-service","version":"dev","uptime_s":3,...}
```

Parar com desligamento gracioso (manda SIGTERM, não SIGKILL):

```bash
./scripts/stop.sh
```

No terminal do servidor aparece o log `sinal recebido, iniciando desligamento gracioso` e depois `conexoes encerradas, saindo`. Enquanto está desligando, o `/health` responde 503.

Testes: `npm test`

### Com Docker

```bash
docker build -t smt-health-service:$(git rev-parse --short HEAD) .
docker run --rm -p 8080:8080 -e PORT=8080 -e APP_VERSION=$(git rev-parse --short HEAD) smt-health-service:$(git rev-parse --short HEAD)
docker stop <container>   # o docker manda SIGTERM, dá pra ver o log de desligamento
```

### Deploy (túnel Cloudflare)

```bash
npm start
cloudflared tunnel --url http://localhost:3000
```

O cloudflared gera uma URL `https://<algo>.trycloudflare.com` que aponta pro serviço local. É um túnel rápido (sem conta), então a URL muda cada vez que roda.

## Variáveis de ambiente

| Variável | Padrão | Para que serve |
|---|---|---|
| `PORT` | 3000 | Porta HTTP em que o serviço escuta |
| `SERVICE_NAME` | smt-health-service | Nome que aparece nos logs e no /health |
| `APP_VERSION` | dev | Versão da release (em deploy, o hash do commit) |
| `LOG_LEVEL` | info | Nível do pino (fatal, error, warn, info, debug, trace, silent) |
| `SHUTDOWN_TIMEOUT_MS` | 10000 | Tempo máximo esperando as conexões fecharem no desligamento |

O `.env` é só pra rodar local e está no `.gitignore`. Em produção as variáveis vêm do ambiente.

## Estrutura

```
src/
  config.js      lê tudo de process.env
  logger.js      pino no stdout
  app.js         rotas (/ e /health)
  server.js      sobe o servidor e trata SIGTERM/SIGINT
scripts/
  start.sh       inicia (exec node, pro sinal chegar direto)
  stop.sh        manda SIGTERM
  check-config.js  tarefa admin one-off
test/
  health.test.js
Dockerfile, Procfile, .env.example, .nvmrc
```

## Mapeamento dos 12 fatores

| Fator | Onde está | Situação |
|---|---|---|
| I. Codebase | este repositório Git, um app = um repo | Implementado |
| II. Dependências | `package.json` + `package-lock.json`, `npm ci` no Dockerfile | Implementado |
| III. Config | `src/config.js`, `.env.example` | Implementado |
| IV. Serviços de apoio | não tem banco nem fila ainda | Adiado |
| V. Build, release, run | `Dockerfile` (build), imagem com tag do commit + env (release), `Procfile` / `npm start` (run) | Implementado |
| VI. Processos | `src/app.js` não guarda nada entre requisições | Implementado |
| VII. Vínculo de porta | `src/server.js` faz `app.listen(config.port)` | Implementado |
| VIII. Concorrência | `Procfile` separa tipos de processo; como é stateless, dá pra subir várias instâncias | Parcial |
| IX. Descartabilidade | `src/server.js` (SIGTERM/SIGINT, `server.close`, timeout), `scripts/stop.sh` | Implementado |
| X. Paridade dev/prod | `.nvmrc`, `engines` no package.json e `node:24-alpine` no Dockerfile | Implementado |
| XI. Logs | `src/logger.js` (JSON no stdout, sem arquivo) | Implementado |
| XII. Processos admin | `scripts/check-config.js` (`npm run admin:check-config`, `release:` no Procfile) | Implementado |

Adiado de propósito: o fator IV, porque o serviço ainda não tem banco nem fila. Quando o SMT começar a receber leitura dos sensores, a entrada vai ser algo como `DATABASE_URL` e `KAFKA_BROKERS` no `config.js`, sem endereço no código. O fator VIII está parcial porque não testei várias instâncias atrás de um balanceador, só deixei o processo pronto pra isso.

## Próximos passos

- Colocar um banco (Postgres) ou broker (Kafka) via URL no ambiente, e o `/health` checar se ele responde
- `docker-compose.yml` com `--scale` pra testar várias instâncias
- Pipeline de CI que builda a imagem com a tag do commit
