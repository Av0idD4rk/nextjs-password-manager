# Устанавливаем базовый образ
FROM node:18.18.2 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# --- Production Stage ---
FROM node:18.18.2 AS production

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "run", "start"]

EXPOSE 3000
