FROM node:20

WORKDIR /app


COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm install

COPY api-gateway/ ./api-gateway/
COPY services/ ./services/
COPY shared/ ./shared/

RUN npm run build:gateway

# VERIFICAR que el archivo existe
RUN ls -la /app/api-gateway/dist/main.js

EXPOSE 3000

# USAR RUTA ABSOLUTA
CMD ["node", "/app/api-gateway/dist/main.js"]                       