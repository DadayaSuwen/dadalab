# ---------------------------------------
# Dockerfile (配合 docker-compose 使用)
# ---------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY

RUN npm run build

FROM node:20-alpine AS production
RUN npm install -g pm2
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY package*.json ./
# 复制依赖和构建产物
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/public ./public

# 生成 PM2 配置 (内部端口 3000)
RUN echo '{' > ecosystem.config.json && \
    echo '  "apps": [{' >> ecosystem.config.json && \
    echo '    "name": "dadalab",' >> ecosystem.config.json && \
    echo '    "script": "node_modules/next/dist/bin/next",' >> ecosystem.config.json && \
    echo '    "args": "start",' >> ecosystem.config.json && \
    echo '    "instances": 1,' >> ecosystem.config.json && \
    echo '    "exec_mode": "fork",' >> ecosystem.config.json && \
    echo '    "env": {' >> ecosystem.config.json && \
    echo '      "NODE_ENV": "production",' >> ecosystem.config.json && \
    echo '      "PORT": "3000"' >> ecosystem.config.json && \
    echo '    },' >> ecosystem.config.json && \
    echo '    "time": true' >> ecosystem.config.json && \
    echo '  }]' >> ecosystem.config.json && \
    echo '}' >> ecosystem.config.json

RUN mkdir -p /var/log/pm2 && chown nextjs:nodejs /var/log/pm2
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["pm2-runtime", "ecosystem.config.json"]