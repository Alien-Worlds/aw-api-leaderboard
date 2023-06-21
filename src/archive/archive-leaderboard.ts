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

export const createRankingsMigrationSets = async (
  redis: RedisSource,
  timeframe: string,
  date: string
) => {
  await Promise.all([
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgToolChargeTime}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolChargeTime}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgChargeTime}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.AvgChargeTime}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgMiningPower}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.AvgMiningPower}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgNftPower}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.AvgNftPower}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgToolMiningPower}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolMiningPower}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.AvgToolNftPower}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.AvgToolNftPower}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.LandsMinedOn}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.LandsMinedOn}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.PlanetsMinedOn}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.PlanetsMinedOn}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.TlmGainsTotal}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.TlmGainsTotal}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.TotalNftPoints}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.TotalNftPoints}`
    ),
    redis.client.RENAME(
      `${timeframe}_${LeaderboardSort.UniqueToolsUsed}`,
      `migration_${date}_${timeframe}_${LeaderboardSort.UniqueToolsUsed}`
    ),
  ]);
  log(`[archive-${date}-${timeframe}-leaderboard] Created migration ranking sets...`);
};

export const removeRankingsMigrationSets = async (
  redis: RedisSource,
  timeframe: string,
  date: string
) => {
  await redis.client.DEL([
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
  ]);
  log(`[archive-${timeframe}-leaderboard] Removed migration ranking sets...`);
};

export const createSnapshotMigrationCollection = async (
  mongo: MongoSource,
  timeframe: string,
  date: string
) => {
  await mongo.database.renameCollection(
    `leaderboard_snapshot_${timeframe}`,
    `leaderboard_snapshot_migration_${date}_${timeframe}`
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
  timeframe: string,
  date: string
) => {
  await mongo.database
    .collection(`leaderboard_snapshot_migration_${date}_${timeframe}`)
    .drop();
  log(`[archive-${timeframe}-leaderboard] Removed migration snapshot collection...`);
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
