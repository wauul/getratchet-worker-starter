FROM node:22-bookworm-slim
RUN corepack enable && corepack prepare pnpm@11.19.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY index.js ./
ENV NODE_ENV=production
USER node
EXPOSE 8080
CMD ["node", "index.js"]
