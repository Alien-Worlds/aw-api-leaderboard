import {
  LeaderboardArchiveMongoSource,
  LeaderboardRankingsRedisSource,
  LeaderboardSnapshotMongoSource,
  LeaderboardSort,
} from '@alien-worlds/alienworlds-api-common';
import { Failure, log, MongoSource, RedisSource, Result } from '@alien-worlds/api-core';

export const createRankingsMigrationSets = async (
  redis: RedisSource,
  timeframe: string
) => {
  await Promise.all([
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgChargeTime}`,
      `migration_${timeframe}_${LeaderboardSort.AvgChargeTime}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgMiningPower}`,
      `migration_${timeframe}_${LeaderboardSort.AvgMiningPower}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgNftPower}`,
      `migration_${timeframe}_${LeaderboardSort.AvgNftPower}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.LandsMinedOn}`,
      `migration_${timeframe}_${LeaderboardSort.LandsMinedOn}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.PlanetsMinedOn}`,
      `migration_${timeframe}_${LeaderboardSort.PlanetsMinedOn}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.TlmGainsTotal}`,
      `migration_${timeframe}_${LeaderboardSort.TlmGainsTotal}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.TotalNftPoints}`,
      `migration_${timeframe}_${LeaderboardSort.TotalNftPoints}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.UniqueToolsUsed}`,
      `migration_${timeframe}_${LeaderboardSort.UniqueToolsUsed}`
    ),
  ]);
  log(`[archive-${timeframe}-leaderboard] Created migration ranking sets...`);
};

export const removeRankingsMigrationSets = async (
  redis: RedisSource,
  timeframe: string
) => {
  await redis.client.DEL([
    `migration_${timeframe}_${LeaderboardSort.AvgChargeTime}`,
    `migration_${timeframe}_${LeaderboardSort.AvgMiningPower}`,
    `migration_${timeframe}_${LeaderboardSort.AvgNftPower}`,
    `migration_${timeframe}_${LeaderboardSort.LandsMinedOn}`,
    `migration_${timeframe}_${LeaderboardSort.PlanetsMinedOn}`,
    `migration_${timeframe}_${LeaderboardSort.TlmGainsTotal}`,
    `migration_${timeframe}_${LeaderboardSort.TotalNftPoints}`,
    `migration_${timeframe}_${LeaderboardSort.UniqueToolsUsed}`,
  ]);
  log(`[archive-${timeframe}-leaderboard] Removed migration ranking sets...`);
};

export const createSnapshotMigrationCollection = async (
  mongo: MongoSource,
  timeframe: string
) => {
  await mongo.database.renameCollection(
    `leaderboard_snapshot_${timeframe}`,
    `leaderboard_snapshot_migration_${timeframe}`
  );
  log(`[archive-${timeframe}-leaderboard] Created migration snapshot collection...`);
};

export const createEmptySnapshotCollection = async (
  mongo: MongoSource,
  timeframe: string
) => {
  const repository = new LeaderboardSnapshotMongoSource(mongo, timeframe);
  log(`[archive-${timeframe}-leaderboard] Created empty snapshot collection...`);
};

export const removeSnapshotMigrationCollection = async (
  mongo: MongoSource,
  timeframe: string
) => {
  await mongo.database.collection(`leaderboard_snapshot_migration_${timeframe}`).drop();
  log(`[archive-${timeframe}-leaderboard] Removed migration snapshot collection...`);
};

export const archive = async (
  mongo: MongoSource,
  redis: RedisSource,
  timeframe: string,
  batchSize = 1000
): Promise<Result> => {
  try {
    const rankingsSource = new LeaderboardRankingsRedisSource(
      redis,
      `migration_${timeframe}`
    );
    const snapshotSource = new LeaderboardSnapshotMongoSource(
      mongo,
      `migration_${timeframe}`
    );
    const archiveSource = new LeaderboardArchiveMongoSource(mongo, timeframe);

    const size = await rankingsSource.count();
    const rounds = Math.ceil(size / batchSize);
    let round = 0;

    log(
      `[archive-${timeframe}-leaderboard] The archiving process is divided into ${rounds} rounds...`
    );
    let inserted = 0;

    while (round < rounds) {
      const snapshots = await snapshotSource.find({
        filter: {},
        options: { skip: round * batchSize, limit: batchSize },
      });
      const wallets = snapshots.map(snapshot => snapshot.wallet_id);
      const rankings = await rankingsSource.getRankings(wallets);
      const documents = snapshots.map(document => {
        document.rankings = rankings[document.wallet_id];
        return document;
      });
      await archiveSource.insertMany(documents);
      inserted += snapshots.length;
      round++;
      log(
        `[archive-${timeframe}-leaderboard] ${inserted} out of ${size} leaderboards have been archived...`
      );
    }
    return Result.withoutContent();
  } catch (error) {
    return Result.withFailure(Failure.fromError(error));
  }
};

export const archiveLeaderboard = async (
  config,
  timeframe: string,
  onMaintenanceComplete: () => void,
  attempt = 1
) => {
  try {
    log(`[archive-${timeframe}-leaderboard] Start archiving...`);

    const mongo = await MongoSource.create(config.mongo);
    const redis = await RedisSource.create(config.redis);

    if (attempt === 1) {
      await Promise.all([
        createRankingsMigrationSets(redis, timeframe),
        createSnapshotMigrationCollection(mongo, timeframe),
      ]);
      await createEmptySnapshotCollection(mongo, timeframe);
      onMaintenanceComplete();
    }

    const archiveResult = await archive(mongo, redis, timeframe, 1000);

    if (archiveResult.isFailure) {
      log(
        `[archive-${timeframe}-leaderboard] Archiving failed.`,
        archiveResult.failure.error
      );
      return Result.withFailure(archiveResult.failure);
    } else {
      await Promise.all([
        removeRankingsMigrationSets(redis, timeframe),
        removeSnapshotMigrationCollection(mongo, timeframe),
      ]);
      log(`[archive-${timeframe}-leaderboard] Archiving was successful.`);
    }

    return Result.withoutContent();
  } catch (error) {
    log(error);
    return Result.withFailure(Failure.fromError(error));
  }
};
