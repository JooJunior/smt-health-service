#!/usr/bin/env bash
# Sobe o servico em primeiro plano. O exec troca o processo do shell pelo node,
# assim o SIGTERM chega direto no node e o desligamento gracioso funciona.
set -e
cd "$(dirname "$0")/.."
exec node --env-file-if-exists=.env src/server.js
