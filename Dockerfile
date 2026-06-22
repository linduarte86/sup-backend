# =========================
# Build
# =========================
FROM node:20-bookworm-slim AS builder

WORKDIR /sup-backend

COPY package.json yarn.lock ./
COPY tsconfig.json ./

RUN yarn install --frozen-lockfile

COPY prisma ./prisma
COPY public ./public
COPY src ./src

RUN npx prisma generate

RUN yarn build

# =========================
# Runtime
# =========================
FROM node:20-bookworm-slim

RUN apt-get update && \
    apt-get install -y postgresql-client-15

WORKDIR /sup-backend

ENV NODE_ENV=production

COPY --from=builder /sup-backend/node_modules ./node_modules
COPY --from=builder /sup-backend/package.json ./package.json

COPY --from=builder /sup-backend/dist ./dist
COPY --from=builder /sup-backend/prisma ./prisma
COPY --from=builder /sup-backend/public ./public

RUN mkdir -p backups uploads tmp

EXPOSE 3333

CMD ["node", "dist/server.js"]
