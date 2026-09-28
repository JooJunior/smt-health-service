#!/usr/bin/env bash
# Manda SIGTERM (e nao SIGKILL) pra dar tempo do servidor fechar as conexoes.
pkill -TERM -f "node.*src/server.js" && echo "SIGTERM enviado" || echo "nenhum processo rodando"
