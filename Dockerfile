FROM node:22-bookworm-slim

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

RUN cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/static

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]