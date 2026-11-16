# BUILDER

FROM node:24-alpine AS leaderboard-api-builder

ARG GITHUB_TOKEN

RUN apk add --no-cache --virtual build-dependencies python3 g++ make curl

WORKDIR /var/www/api

ADD scripts /var/www/api/scripts
ADD src /var/www/api/src
ADD docs /var/www/api/docs

COPY package.json .npmrc .yarnrc tsconfig.json tsconfig.build.json yarn.lock /var/www/api/
COPY .env-example /var/www/api/.env

# build needs devDependencies (typescript), so install everything first and prune after.
# --ignore-scripts: the package's own prepublish runs tsc/clean on install.
RUN yarn install --frozen-lockfile --ignore-scripts
RUN yarn build
RUN yarn install --frozen-lockfile --production --ignore-scripts

# PRODUCTION

FROM node:24-alpine AS leaderboard-api

WORKDIR /var/www/api

COPY --from=leaderboard-api-builder /var/www/api /var/www/api
CMD [ "yarn", "start" ]