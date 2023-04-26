FROM node:18-alpine3.15
WORKDIR /datav
COPY package.json .
RUN npm install
COPY . .
