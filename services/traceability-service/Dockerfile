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

RUN npm run build:traceability

# VERIFICAR que el archivo existe
RUN ls -la /app/dist/traceability-service/services/traceability-service/src/main.js

EXPOSE 3007

# USAR RUTA ABSOLUTA
CMD ["node", "/app/dist/traceability-service/services/traceability-service/src/main.js"]