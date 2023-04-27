# Alien Worlds Leaderboard API

Leaderboard API provides access to data for Alien Worlds leaderboard.

The API is responsible to only serve the data which is populated into database by the [history tools](https://github.com/Alien-Worlds/leaderboard-api-history-tools).

To learn more about history tools and how to read data from blockchain and populate into database, please refer to the respective repository [leaderboard-api-history-tools](https://github.com/Alien-Worlds/leaderboard-api-history-tools).

## Environments

The Leaderboard API is available in three environments - Production, Staging, and Development - each has its own purpose and is used for different stages of the development process.

1. **Production** (https://api.alienworlds.io)
It is the live version of the API, used by end-users to access leaderboard data.

2. **Staging** (https://api-stage.alienworlds.io)
It serves the upcoming release candidate API, where new features and changes are tested by the UI team before being deployed to Production environment.

3. **Development** (https://api-dev.alienworlds.io)
It is used internally by the API development team to test new features and changes before deploying to staging environment. This environment may have more frequent updates and changes.

## Endpoints

### List

HTTP Method: `GET`
Endpoint: `/v1/leaderboard/list`

List leaderboard entries.

#### Request

##### Query Parameters

- `timeframe`
  - Possible values 
    - `daily` (default)
    - `weekly`
    - `monthly` 
- `sort`
  - Possible values
    - `tlm_gains_total` (default)
    - `total_nft_points`
    - `avg_charge_time`
    - `avg_mining_power`
    - `avg_nft_power`
    - `lands_mined_on`
    - `planets_mined_on`
    - `unique_tools_used`
- `order`
  - Possible values
    - `-1` - Descending (default)
    - `1` - Ascending
- `offset`
  - Number of items to skip before starting to return result set. 
  - Default: `0`
- `limit`
  - Number of result items to return.
  - Default: `10`
- `date`
  - Date within the specified `timeframe`. Based on this value, the start (`fromDate`) and end (`toDate`) of the timeframe will be calculated
- `fromDate`
  - Fixed timeframe start value in ISO 8601 format e.g. `2022-04-17T00:00:00.000Z`. 
  - If `date` is also specified, then `fromDate` will override it
- `toDate`
  - Fixed timeframe end value in ISO 8601 format e.g. `2023-02-12T00:00:00.000Z`.
  - If `date` is also specified, then `toDate` will override it

### Find user

HTTP Method: `GET`
Endpoint: `/v1/leaderboard/find`

Find leaderboard data for a specific user.

#### Request

##### Query Parameters

- `user`
  - Wallet Id of the user to find
- `timeframe`
  - Possible values 
    - `daily` (default)
    - `weekly`
    - `monthly` 
- `date`
  - Date within the specified `timeframe`. Based on this value, the start (`fromDate`) and end (`toDate`) of the timeframe will be calculated
- `fromDate`
  - Fixed timeframe start value in ISO 8601 format e.g. `2022-04-17T00:00:00.000Z`. 
  - If `date` is also specified, then `fromDate` will override it
- `toDate`
  - Fixed timeframe end value in ISO 8601 format e.g. `2023-02-12T00:00:00.000Z`.
  - If `date` is also specified, then `toDate` will override it
## Local development environment

#### Prerequisites

Before running the API on your local machine, ensure that you have the following installed:
1. [Node.js](https://nodejs.org/en) 
2. Node package manager ([yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) or npm)
3. [MongoDB](https://www.mongodb.com/docs/manual/installation/) native installation or running inside a Docker container
4. [Redis](https://redis.io/docs/getting-started/installation/) native installation or running inside a Docker container

#### Additional tools

Optionally, you can choose to install the following tools or any other alternatives.

1. [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) - Redis Client
2. [Compass](https://www.mongodb.com/products/compass) - The GUI for MongoDB
3. [Docker](https://www.docker.com/) to run MongoDB and Redis (if not installed natively)

#### Clone the repository  

```
git clone https://github.com/Alien-Worlds/leaderboard-api.git
```

#### Environment variables

You need a *.env* file which contains all necessary environment configuration for Leaderboard API. An example config file is available at *[.env-example](https://github.com/Alien-Worlds/leaderboard-api/blob/main/.env-example)*.

You can copy the example config and create a *.env* file

```
cp .env-example .env
```

Afterwards, the newly created *.env* file can be modified according to your needs.

#### Run MongoDB

Run MongoDB either with native installation or using Docker.

To use Docker, an example Docker Compose file for MongoDB is available at *[docker-compose-mongodb.yml](https://github.com/Alien-Worlds/leaderboard-api/blob/main/docker-compose-mongodb.yml)*

#### Run Redis

Run Redis either with native installation or using Docker.

To use Docker, an example Docker Compose file for Redis is available at *[docker-compose-redis.yml](https://github.com/Alien-Worlds/leaderboard-api/blob/main/docker-compose-redis.yml)*

#### Build API

```
yarn
yarn build
```

#### Start API

```
yarn start
```

### Postman API Collection

Please check Postman API collection
```
.postman/leaderboard-api.postman_collection.json
```

The respective environment files for *local*, *dev*, *stage* and *prod* are also placed under *.postman/environments/leaderboard-\*.postman_environment.json* e.g.
```
.postman/environments/leaderboard-local.postman_environment.json
```