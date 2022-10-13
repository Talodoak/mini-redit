FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY ./ ./

COPY .env.example .env

RUN yarn install

ENV NODE_ENV production

EXPOSE 4555
CMD [ "yarn", "run", "prod" ]