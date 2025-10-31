FROM node:20

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm install

# Copiar SOLO archivos TypeScript, EXCLUIR .env
COPY api-gateway/ ./api-gateway/
COPY services/ ./services/
COPY shared/ ./shared/

# ELIMINAR archivos .env si existen
RUN find ./api-gateway -name "*.env" -delete && \
    find ./services -name "*.env" -delete && \
    find ./shared -name "*.env" -delete

RUN npm run build:auth

RUN ls -la /app/dist/auth-service/services/auth-service/src/main.js

EXPOSE 3001

CMD ["node", "/app/dist/auth-service/services/auth-service/src/main.js"]