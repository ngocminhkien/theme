FROM node:20-alpine AS builder

WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY package*.json ./
RUN npm ci || npm install

COPY tsconfig.json ./
COPY postcss.config.js* tailwind.config.js* next.config.js* ./
COPY src ./src
COPY public ./public
RUN npm run build
RUN mkdir -p /app/.next

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js* ./

EXPOSE 3001
CMD ["npm", "start"]
