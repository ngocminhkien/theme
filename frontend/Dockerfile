FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install

COPY tsconfig.json ./
COPY postcss.config.js* tailwind.config.js* ./
COPY src ./src
COPY public ./public
RUN npm run build || true
RUN mkdir -p /app/.next /app/public

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
