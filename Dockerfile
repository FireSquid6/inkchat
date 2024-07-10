FROM oven/bun AS base
WORKDIR /app


FROM base AS build
RUN mkdir -p /temp/prod
WORKDIR /temp/prod

COPY . /temp/prod/
RUN bun install --frozen-lockfile --production && bun run build-server
CMD ["ls"]

FROM base AS production
COPY --from=build /temp/prod/dist /app
COPY --from=build /temp/prod/drizzle /app/drizzle
CMD ["bun", "run", "prod.js"]
