FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm run build:client

COPY src/server.js ./src/

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
