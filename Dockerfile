# BUILDER

FROM node:17-alpine3.15 AS leaderboard-api-builder

ARG GITHUB_TOKEN

RUN apk add --no-cache --virtual build-dependencies g++ make curl

RUN mkdir -p /var/leaderboard-api

WORKDIR /var/leaderboard-api

ADD scripts /var/leaderboard-api/scripts
ADD src /var/leaderboard-api/src

COPY package.json .npmrc tsconfig.json tsconfig.build.json yarn.lock /var/leaderboard-api/

RUN yarn
RUN yarn build:prod

# PRODUCTION

FROM node:17-alpine3.15 AS leaderboard-api

ARG GITHUB_TOKEN

WORKDIR /var/leaderboard-api

COPY package.json .npmrc ./
COPY --from=leaderboard-api-builder /var/leaderboard-api/build ./build

RUN yarn --production
