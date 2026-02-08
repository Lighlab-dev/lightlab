FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4173
ENV HOME=/home/app
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app && \
	mkdir -p /home/app/.cache/node/corepack && \
	chown -R app:app /home/app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
COPY --from=build /app/dist ./dist
USER app
EXPOSE 4173
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]
