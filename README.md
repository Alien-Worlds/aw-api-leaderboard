# leadeboard collection

You need .env file or use env variables
```
PORT=8800

MONGO_HOSTS='localhost'
MONGO_PORTS='27017'
MONGO_DB_NAME='leaderboard'

REDIS_HOSTS='localhost'
REDIS_PORTS='6379'
REDIS_DATABASE='1'
REDIS_IANA=0
```

For local development run mongodb and redis (eg. in docker)

redis example docker compose file
```
version: '3.7'
  services:

    redis:
      image: 'redis:alpine'
      restart: always
      ports: - '6379:6379'

```

mongodb example docker compose file
```
version: "3.2"
  services:
    mongo:
      image: mongo
      container_name: 'mongo'
      restart: always
      ports: - '27017:27017'
      networks: - mongo_net

networks:
  mongo_net:
    driver: bridge

```

Build & run

```
yarn build
yarn start
```

Please keep in mind taht redis is not used yet.

Please check postman collection
```
.postman/Leaderboard API.postman_collection.json
```