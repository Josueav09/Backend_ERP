FROM node:20

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm install

COPY api-gateway/ ./api-gateway/
COPY services/ ./services/
COPY shared/ ./shared/

RUN npm run build:auth

# VERIFICAR que el archivo existe
RUN ls -la /app/dist/auth-service/services/auth-service/src/main.js

EXPOSE 3001

# USAR RUTA ABSOLUTA
CMD ["node", "/app/dist/auth-service/services/auth-service/src/main.js"]