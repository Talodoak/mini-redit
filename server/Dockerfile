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

#FROM node:lts-slim  as builder
#
#WORKDIR /usr/src/app
#COPY package*.json ./
#RUN npm ci --omit=dev
#
#COPY ./ ./
#RUN yarn build
#
## Build Stage 2
## This build takes the production build from staging build
#FROM node:lts-slim
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#COPY .env.example .env
#RUN npm ci --omit=dev
#COPY --from=builder /usr/src/app/dist ./dist
#EXPOSE 4555
#CMD ["yarn","prod"]