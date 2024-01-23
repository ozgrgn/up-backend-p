FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./


RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y build-essential

RUN yarn

COPY . .
CMD [ "yarn", "start" ]