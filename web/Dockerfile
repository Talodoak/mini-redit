FROM node:16-alpine3.11 as dependencies

COPY package.json yarn.lock ./
RUN yarn install

FROM node:16-alpine3.11 as builder
COPY . .
COPY --from=dependencies /node_modules ./node_modules
RUN yarn build:production

FROM node:16-alpine3.11 as runner
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /my-project/next.config.js ./
#COPY --from=builder /public ./public
COPY --from=builder /.next ./.next
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]