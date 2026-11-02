#!/bin/sh
# Starts the given image against throwaway MongoDB and Redis containers and
# checks the API answers. Usage: scripts/smoke-test.sh <image>

IMAGE=${1:?"usage: smoke-test.sh <image>"}
SUFFIX=$$
NETWORK=aw-leaderboard-smoke-$SUFFIX
API=aw-leaderboard-api-$SUFFIX
BASE=http://localhost:8800/v1/leaderboard

cleanup()
{
    docker rm -f "$API" "mongo-$SUFFIX" "redis-$SUFFIX" >/dev/null 2>&1
    docker network rm "$NETWORK" >/dev/null 2>&1
}
trap cleanup EXIT

fail()
{
    echo "Error: $1"
    echo "--- api logs ---"
    docker logs "$API" 2>&1 | tail -30
    exit 1
}

docker pull -q mongo:7 >/dev/null && docker pull -q redis:7-alpine >/dev/null || exit 1
docker network create "$NETWORK" >/dev/null || exit 1
docker run -d --name "mongo-$SUFFIX" --network "$NETWORK" --network-alias mongo mongo:7 >/dev/null || exit 1
docker run -d --name "redis-$SUFFIX" --network "$NETWORK" --network-alias redis redis:7-alpine >/dev/null || exit 1

docker run -d --name "$API" --network "$NETWORK" \
    -e LEADERBOARD_API_MONGO_HOSTS=mongo \
    -e LEADERBOARD_API_REDIS_HOSTS=redis \
    "$IMAGE" >/dev/null || exit 1

# wait for the container's own HEALTHCHECK to pass
i=0
until [ "$(docker inspect -f '{{.State.Health.Status}}' "$API")" = "healthy" ]; do
    i=$((i + 1))
    [ "$i" -gt 40 ] && fail "container did not become healthy"
    [ "$(docker inspect -f '{{.State.Running}}' "$API")" = "true" ] || fail "container exited"
    sleep 3
done

# the dependency check goes through the API itself, so run curl inside it
get()
{
    docker exec "$API" wget -q -O - "$BASE/$1"
}

get ping | grep -q pong || fail "/ping did not answer pong"

HEALTH=$(get health) || fail "/health request failed"
echo "$HEALTH"
echo "$HEALTH" | grep -q '"status":"OK"' || fail "/health status is not OK"
echo "$HEALTH" | grep -q '"status":"ERROR"' && fail "a dependency reports ERROR"

echo "Smoke test passed"
