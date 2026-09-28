# smt-health-service

API simples em Node.js + Express com um endpoint `/health`, feita seguindo o 12-Factor App.
SMT = Sistema de Monitoramento de Tráfego.

Stack: Node.js 24, Express 5, pino (logs). Licença MIT.

## Como rodar

Precisa do Node 24 (`nvm use` pega a versão do `.nvmrc`).

```bash
npm ci
cp .env.example .env
npm run admin:check-config
npm start
```

Testar:

```bash
curl http://localhost:3000/health
```

Parar (manda SIGTERM, o servidor fecha as conexões antes de sair):

```bash
./scripts/stop.sh
```

Testes: `npm test`

Docker:

```bash
docker build -t smt-health-service:$(git rev-parse --short HEAD) .
docker run --rm -p 8080:8080 -e PORT=8080 smt-health-service:$(git rev-parse --short HEAD)
```

Deploy com túnel da Cloudflare (a URL muda toda vez que roda):

```bash
cloudflared tunnel --url http://localhost:3000
```

## Variáveis de ambiente

Ver `.env.example`.

- `PORT`: porta HTTP (padrão 3000)
- `SERVICE_NAME`: nome que sai no log e no /health
- `APP_VERSION`: versão/hash do commit
- `LOG_LEVEL`: nível do log (info, debug, error...)
- `SHUTDOWN_TIMEOUT_MS`: quanto tempo espera as conexões fecharem ao desligar

## 12 fatores

- I. Codebase: este repositório
- II. Dependências: `package.json` + `package-lock.json`
- III. Config: `src/config.js` e `.env.example`
- V. Build, release, run: `Dockerfile`, imagem com tag do commit, `Procfile`
- VI. Processos: `src/app.js` não guarda estado
- VII. Porta: `src/server.js` (`app.listen(config.port)`)
- IX. Descartabilidade: SIGTERM em `src/server.js` e `scripts/stop.sh`
- X. Paridade dev/prod: `.nvmrc` e `node:24-alpine` no Dockerfile
- XI. Logs: `src/logger.js`, JSON no stdout
- XII. Admin: `scripts/check-config.js`

Ficaram de fora por enquanto: IV (serviços de apoio), porque ainda não tem banco nem fila, e VIII (concorrência), porque não testei várias instâncias com balanceador.
