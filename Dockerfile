# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS frontend-build

# Build do frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Imagem final
FROM node:18-alpine AS production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Configurar diretório de trabalho
WORKDIR /app

# Copiar package.json do backend
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar código do backend
COPY backend/ ./

# Copiar frontend buildado
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Alterar ownership para usuário não-root
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http');const options={hostname:'localhost',port:3001,path:'/api/health',timeout:2000};const req=http.request(options,(res)=>{process.exit(res.statusCode===200?0:1)});req.on('error',()=>process.exit(1));req.end();"

# Comando para iniciar aplicação
CMD ["npm", "start"]
