# BUILDER

FROM node:17-alpine3.12 AS leaderboard-api-builder

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=${GITHUB_TOKEN}

RUN apk add --no-cache --virtual build-dependencies python2 g++ make

RUN apk add curl

RUN mkdir -p /var/leaderboard-api

WORKDIR /var/leaderboard-api

ADD scripts /var/leaderboard-api/scripts
ADD src /var/leaderboard-api/src

COPY package.json .npmrc tsconfig.json tsconfig.build.json yarn.lock /var/leaderboard-api/

RUN yarn
RUN yarn build

# PRODUCTION

FROM node:17-alpine3.12 AS leaderboard-api

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=${GITHUB_TOKEN}

WORKDIR /var/leaderboard-api

COPY package.json .npmrc .env ./
COPY --from=leaderboard-api-builder /var/leaderboard-api/build ./build

RUN yarn --production