FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install recharts

COPY . .
RUN npm run build
