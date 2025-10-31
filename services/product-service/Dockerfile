FROM node:18-alpine

WORKDIR /app

# Copiar package.json global y del servicio
COPY ../../package*.json ./
COPY package*.json ./

# Copiar configuración de TypeScript (global y específica del servicio)
COPY backend_ERP/tsconfig*.json ./
COPY backend_ERP/services/product-service/tsconfig*.json ./


RUN npm ci --only=production

# Copiar código fuente
COPY . .
COPY ../../shared/ ./shared/
 
EXPOSE 3004

CMD ["node", "../../dist/product-service/main"]