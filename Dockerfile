# BUILDER

FROM node:24-alpine AS leaderboard-api-builder

RUN apk add --no-cache --virtual build-dependencies python3 g++ make curl

WORKDIR /var/www/api

COPY package.json .npmrc .yarnrc tsconfig.json tsconfig.build.json yarn.lock /var/www/api/

RUN yarn install --frozen-lockfile --ignore-scripts

ADD scripts /var/www/api/scripts
ADD src /var/www/api/src
ADD docs /var/www/api/docs

RUN yarn build

# drop devDependencies now that the build is done
RUN yarn install --frozen-lockfile --production --ignore-scripts

# PRODUCTION

FROM node:24-alpine AS leaderboard-api

ENV NODE_ENV=production

WORKDIR /var/www/api

COPY --chown=node:node --from=leaderboard-api-builder /var/www/api/node_modules ./node_modules
COPY --chown=node:node --from=leaderboard-api-builder /var/www/api/build ./build
COPY --chown=node:node --from=leaderboard-api-builder /var/www/api/docs ./docs
COPY --chown=node:node --from=leaderboard-api-builder /var/www/api/package.json ./package.json
COPY --chown=node:node .env-example ./.env

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:${LEADERBOARD_API_PORT:-8800}/v1/leaderboard/ping || exit 1

CMD [ "yarn", "start" ]
