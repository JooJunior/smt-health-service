FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY scripts ./scripts

USER node
EXPOSE 3000

# node direto em vez de "npm start": o npm nao repassa o SIGTERM direito pro processo filho
CMD ["node", "src/server.js"]
