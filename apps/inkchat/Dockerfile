FROM oven/bun AS base
WORKDIR /app


FROM base AS build
COPY . .
RUN bun install --frozen-lockfile 
RUN bun run build
RUN bun run generate

FROM base AS production
COPY --from=build /app/dist /app/dist
COPY --from=build /app/drizzle /app/drizzle
CMD ["bun", "run", "./dist/prod.js"]
