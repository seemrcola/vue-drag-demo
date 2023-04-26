FROM node:18-alpine3.15
FROM pnpm:latest
WORKDIR /datav
COPY package.json .
RUN pnpm install
COPY . .
