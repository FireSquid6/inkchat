FROM oven/bun AS base
WORKDIR /app


FROM base AS build
RUN mkdir -p /temp/prod
WORKDIR /temp/prod

COPY . /temp/prod/
RUN bun install --frozen-lockfile --production 

FROM base AS production
COPY --from=build /app /app
CMD ["bun", "run", "prod.js"]

