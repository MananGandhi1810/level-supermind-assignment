FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]