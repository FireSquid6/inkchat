FROM oven/bun AS base
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --production
CMD ["bun", "run", "dev"]
