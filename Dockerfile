# Образ клієнтського застосунку (Next.js). Два етапи: збирання і запуск.

# ---------- Етап 1: збирання ----------
FROM node:22-slim AS build
WORKDIR /app

# Спершу лише опис залежностей — щоб Docker кешував встановлені пакети.
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Адреса сервера вшивається в JavaScript ПІД ЧАС ЗБИРАННЯ (усі змінні
# NEXT_PUBLIC_…), а не під час запуску. Тому вона передається як аргумент
# збирання: docker-compose.yml → build.args. Запити надсилає браузер, а він
# працює на вашому комп'ютері — тому тут localhost, а не назва контейнера.
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Вмикає output: "standalone" у next.config.ts: у .next/standalone складається
# готовий сервер разом із потрібними файлами з node_modules.
ENV NEXT_OUTPUT=standalone
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Етап 2: запуск ----------
FROM node:22-slim
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Слухати на всіх мережевих інтерфейсах контейнера, інакше зовні сайт не відкриється.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app

# Готовий сервер. Статичні файли і папку public режим standalone не копіює сам.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
