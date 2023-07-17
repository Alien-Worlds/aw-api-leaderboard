# BUILDER

FROM node:17-alpine3.15 AS leaderboard-api-builder

ARG GITHUB_TOKEN

RUN apk add --no-cache --virtual build-dependencies python3 g++ make curl

WORKDIR /var/www/api

ADD scripts /var/www/api/scripts
ADD src /var/www/api/src
ADD docs /var/www/api/docs

COPY package.json .npmrc tsconfig.json tsconfig.build.json yarn.lock /var/www/api/
COPY .env-example /var/www/api/.env

RUN yarn --production
RUN yarn build

# PRODUCTION

FROM node:17-alpine3.15 AS leaderboard-api

WORKDIR /var/www/api

COPY --from=leaderboard-api-builder /var/www/api /var/www/api
CMD [ "yarn", "api" ]