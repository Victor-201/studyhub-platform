FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production --ignore-scripts

COPY server.js ./

EXPOSE ${PORT:-8000}

CMD ["node", "server.js"]
