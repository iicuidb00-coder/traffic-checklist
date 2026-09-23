FROM node:22-bookworm-slim

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

# standalone에 필요한 파일 복사
RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]