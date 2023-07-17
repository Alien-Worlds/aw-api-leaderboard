/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DataSourceBulkWriteError,
  Failure,
  MongoSource,
  RedisSource,
  Result,
  log,
} from '@alien-worlds/api-core';
import {
  LeaderboardArchiveMongoSource,
  LeaderboardRankingsRedisSource,
  LeaderboardSnapshotMongoSource,
  LeaderboardSort,
} from '@alien-worlds/leaderboard-api-common';

const RedisRenameSortedSet = async (redis: RedisSource, key: string, newKey: string) => {
  log(`Attempt to rename Redis set '${key}' to '${newKey}'`);
  return await redis.client.RENAME(key, newKey);
};

const RedisDeleteSortedSet = async (redis: RedisSource, key: string) => {
  log(`Attempt to delete Redis set ${key}`);
  return await redis.client.DEL(key);
};

const RedisCheckIfKeyExists = async (
  redis: RedisSource,
  key: string
): Promise<number> => {
  const result = await redis.client.EXISTS(key);

  if (result == 0) {
    log(`[ERR] Redis set '${key}' does NOT exist`);
  }
  return result;
};

export const createRankingsMigrationSets = async (
  redis: RedisSource,
  timeframe: string,
  date: string
) => {
  log(
    `[archive-${date}-${timeframe}-leaderboard] Attempt to create migration ranking sets.`
  );

  const rankingsMigrationSets = [
    {
      key: `${timeframe}_${LeaderboardSort.AvgToolChargeTime}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolChargeTime}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.AvgChargeTime}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.AvgChargeTime}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.AvgMiningPower}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.AvgMiningPower}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.AvgNftPower}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.AvgNftPower}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.AvgToolMiningPower}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolMiningPower}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.AvgToolNftPower}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolNftPower}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.LandsMinedOn}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.LandsMinedOn}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.PlanetsMinedOn}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.PlanetsMinedOn}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.TlmGainsTotal}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.TlmGainsTotal}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.TotalNftPoints}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.TotalNftPoints}`,
    },
    {
      key: `${timeframe}_${LeaderboardSort.UniqueToolsUsed}`,
      newKey: `migration_${date}_${timeframe}_${LeaderboardSort.UniqueToolsUsed}`,
    },
  ];

  const RedisSetsNotFound: string[] = [];
  const renameSetsPromises = rankingsMigrationSets.map(async set => {
    const exists = await RedisCheckIfKeyExists(redis, set.key);
    if (exists) {
      await RedisRenameSortedSet(redis, set.key, set.newKey);
    } else {
      RedisSetsNotFound.push(set.key);
    }
  });

  await Promise.all(renameSetsPromises);

  log(
    `[archive-${date}-${timeframe}-leaderboard] Created migration ranking sets (${
      rankingsMigrationSets.length - RedisSetsNotFound.length
    }/${rankingsMigrationSets.length})`
  );

  if (RedisSetsNotFound.length) {
    throw new Error(
      `Redis set(s) to rename not found (${RedisSetsNotFound.join(', ')}})`
    );
  }
};

export const removeRankingsMigrationSets = async (
  redis: RedisSource,
  timeframe: string,
  date: string
) => {
  log(
    `[archive-${date}-${timeframe}-leaderboard] Attempt to delete migration ranking sets.`
  );

  const rankingsMigrationSets = [
    `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolChargeTime}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.AvgChargeTime}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.AvgMiningPower}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.AvgNftPower}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolMiningPower}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolNftPower}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.LandsMinedOn}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.PlanetsMinedOn}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.TlmGainsTotal}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.TotalNftPoints}`,
    `migration_${date}_${timeframe}_${LeaderboardSort.UniqueToolsUsed}`,
  ];

  const RedisSetsNotFound: string[] = [];
  const deleteSetsPromises = rankingsMigrationSets.map(async key => {
    const exists = await RedisCheckIfKeyExists(redis, key);
    if (exists) {
      await RedisDeleteSortedSet(redis, key);
    } else {
      RedisSetsNotFound.push(key);
    }
  });

  await Promise.all(deleteSetsPromises);

  log(
    `[archive-${date}-${timeframe}-leaderboard] Deleted migration ranking sets (${
      rankingsMigrationSets.length - RedisSetsNotFound.length
    }/${rankingsMigrationSets.length})`
  );

  if (RedisSetsNotFound.length) {
    throw new Error(
      `Redis set(s) to delete not found (${RedisSetsNotFound.join(', ')}})`
    );
  }
};

export const createSnapshotMigrationCollection = async (
  mongo: MongoSource,
  timeframe: string,
  date: string
) => {
  const currentName = `leaderboard_snapshot_${timeframe}`;
  const newName = `leaderboard_snapshot_migration_${date}_${timeframe}`;

  log(`Attempt to rename Mongo collection '${currentName}' to '${newName}'`);
  await mongo.database.renameCollection(currentName, newName);

  log(`[archive-${timeframe}-leaderboard] Created migration snapshot collection...`);
};

export const createEmptySnapshotCollection = async (
  mongo: MongoSource,
  timeframe: string
) => {
  log(`[archive-${timeframe}-leaderboard] Attempt to create empty snapshot collection`);

  const repository = new LeaderboardSnapshotMongoSource(mongo, timeframe);

  log(`[archive-${timeframe}-leaderboard] Created empty snapshot collection...`);
};

export const removeSnapshotMigrationCollection = async (
  mongo: MongoSource,
  timeframe: string,
  date: string
) => {
  const collectionToRemove = `leaderboard_snapshot_migration_${date}_${timeframe}`;

  log(
    `[archive-${timeframe}-leaderboard] Attempt to remove Mongo collection '${collectionToRemove}'`
  );

  await mongo.database.collection(collectionToRemove).drop();

  log(
    `[archive-${timeframe}-leaderboard] Removed migration snapshot collection '${collectionToRemove}'`
  );
};

export const archive = async (
  mongo: MongoSource,
  redis: RedisSource,
  timeframe: string,
  date: string,
  batchSize = 1000,
  maxAttemptsPerBatch: number
): Promise<Result> => {
  try {
    const rankingsSource = new LeaderboardRankingsRedisSource(
      redis,
      `migration_${date}_${timeframe}`
    );

    const snapshotSource = new LeaderboardSnapshotMongoSource(
      mongo,
      `migration_${date}_${timeframe}`
    );

    const archiveSource = new LeaderboardArchiveMongoSource(mongo, timeframe);

    const size = await rankingsSource.count();
    const totalBatches = Math.ceil(size / batchSize);
    log(
      `[archive-${timeframe}-leaderboard] The archiving process is divided into ${totalBatches} batches...`
    );

    let currBatch = 0,
      failedBatchCount = 0,
      inserted = 0;

    while (currBatch < totalBatches) {
      let attempts = 0;

      const snapshotFindParams = {
        filter: {},
        options: { skip: failedBatchCount * batchSize, limit: batchSize },
      };

      while (attempts < maxAttemptsPerBatch) {
        try {
          const snapshots = await snapshotSource.find(snapshotFindParams);

          const wallets = snapshots.map(snapshot => snapshot.wallet_id);
          const rankings = await rankingsSource.getRankings(wallets);

          const documents = snapshots.map(document => {
            document.rankings = rankings[document.wallet_id];
            return document;
          });
          if (documents && documents.length) {
            try {
              await archiveSource.insertMany(documents);
            } catch (error) {
              if (
                error instanceof DataSourceBulkWriteError &&
                error.onlyDuplicateErrors === true
              ) {
                log(error);
                log(`Archiving continues...`);
              } else {
                throw error;
              }
            }
          }

          // Remove processed snapshot entries
          const processedSnapshotIds = snapshots.map(snp => snp._id);
          await snapshotSource.removeMany(processedSnapshotIds);

          inserted += snapshots.length;
          break;
        } catch (error) {
          attempts++;

          if (attempts === maxAttemptsPerBatch) {
            failedBatchCount++;
            console.error(
              `Failed to process batch ${currBatch} after ${attempts} attempts due to an error. Continuing to process next batch`,
              error
            );
            break;
          }
        }
      }

      currBatch++;
      log(
        `[archive-${timeframe}-leaderboard] ${inserted} out of ${size} leaderboards have been archived...`
      );
    }

    if (failedBatchCount) {
      return Result.withFailure(
        Failure.withMessage(
          `${failedBatchCount} out of ${totalBatches} failed to process.`
        )
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

    const today = getFormattedDateString(new Date());

    if (attempt === 1) {
      await Promise.all([
        createRankingsMigrationSets(redis, timeframe, today),
        createSnapshotMigrationCollection(mongo, timeframe, today),
      ]);

      await createEmptySnapshotCollection(mongo, timeframe);

      onMaintenanceComplete();
    }

    const archiveResult = await archive(
      mongo,
      redis,
      timeframe,
      today,
      1000,
      config.maxAttemptsPerBatch
    );

    if (archiveResult.isFailure) {
      log(
        `[archive-${timeframe}-leaderboard] Archiving failed.`,
        archiveResult.failure.error
      );
      return Result.withFailure(archiveResult.failure);
    } else {
      await Promise.all([
        removeRankingsMigrationSets(redis, timeframe, today),
        removeSnapshotMigrationCollection(mongo, timeframe, today),
      ]);
      log(`[archive-${timeframe}-leaderboard] Archiving was successful.`);
    }

    return Result.withoutContent();
  } catch (error) {
    log(error);
    return Result.withFailure(Failure.fromError(error));
  }
};

const getFormattedDateString = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${day}${month}${year}`;
};
