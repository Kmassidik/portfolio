# syntax=docker/dockerfile:1

FROM oven/bun:1-alpine
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 4173
# Serve the built static site — NOT the dev server (which exposes source).
CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "4173"]
