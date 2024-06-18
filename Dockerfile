FROM oven/bun:1 as base
WORKDIR /app

FROM base as install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile


RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod
RUN cd /temp/prod && bun install --froze-lockfile --production


FROM base as prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun test


FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app .


USER bun
EXPOSE 3000
ENTRYPOINT ["bun", "run", "index.ts"]
