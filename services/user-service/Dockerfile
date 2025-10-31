FROM node:20

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm install

COPY api-gateway/ ./api-gateway/
COPY services/ ./services/
COPY shared/ ./shared/

RUN npm run build:user

EXPOSE 3002

# RUTA CONFIRMADA
CMD ["node", "/app/services/user-service/dist/services/user-service/src/main.js"]