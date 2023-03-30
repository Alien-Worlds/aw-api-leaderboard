import { Failure, getParams, QueryModel, Result, UpdateStatus } from '@alien-worlds/api-core';

import { Leaderboard } from '../../domain/entities/leaderboard';
import { MiningLeaderboardOrder, MiningLeaderboardSort } from '../../domain/mining-leaderboard.enums';
import { MiningLeaderboardRepository } from '../../domain/repositories/mining-leaderboard.repository';
import { LeaderboardMongoSource } from '../data-sources/leaderboard.mongo.source';
import { LeaderboardRedisSource } from '../data-sources/leaderboard.redis.source';
import { UserLeaderboardNotFoundError } from './../../domain/errors/user-leaderboard-not-found.error';

export class LeaderboardRepositoryImpl implements MiningLeaderboardRepository {
  constructor(
    protected readonly mongoSource: LeaderboardMongoSource,
    protected readonly redisSource: LeaderboardRedisSource
  ) { }

  public async findUsers(
    walletIds: string[],
    fromDate: Date,
    toDate: Date,
    sort?: MiningLeaderboardSort
  ): Promise<Result<Leaderboard[], Error>> {
    try {
      const { mongoSource } = this;
      const documents = await mongoSource.find({
        filter: {
          $and: [
            {
              start_timestamp: { $gte: new Date(fromDate.toISOString()) },
            },
            {
              end_timestamp: { $lte: new Date(toDate.toISOString()) },
            },
            {
              wallet_id: { $in: walletIds },
            },
          ],
        },
      });

      let entities: Leaderboard[] = [];

      if (sort) {
        for (const document of documents) {
          const rank = await this.redisSource.getRank(document.wallet_id, sort);
          entities.push(Leaderboard.fromDocument(document, rank + 1));
        }
      } else {
        entities = documents.map(Leaderboard.fromDocument);
      }

      return Result.withContent(entities);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async findUser(
    user: string,
    fromDate: Date,
    toDate: Date,
    sort?: MiningLeaderboardSort
  ): Promise<Result<Leaderboard, Error>> {
    try {
      const { mongoSource } = this;
      const document = await mongoSource.findOne({
        filter: {
          $and: [
            {
              start_timestamp: { $gte: new Date(fromDate.toISOString()) },
            },
            {
              end_timestamp: { $lte: new Date(toDate.toISOString()) },
            },
            {
              wallet_id: user,
            },
          ],
        },
      });

      let rank: number;

      if (document) {
        if (sort) {
          rank = await this.redisSource.getRank(document.wallet_id, sort);
        }

        return Result.withContent(Leaderboard.fromDocument(document, rank + 1));
      }

      return Result.withFailure(
        Failure.fromError(new UserLeaderboardNotFoundError(user))
      );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async updateMany(
    leaderboards: Leaderboard[]
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    try {
      const documents = leaderboards.map(leaderboard => leaderboard.toDocument());

      await this.mongoSource.updateManyByWalletId(documents);

      // add to redis only if the timeframe corresponds to the current date.
      // The rest is probably history.
      const latestDocuments = documents.filter(document => {
        const { start_timestamp, end_timestamp } = document;
        const now = Date.now();
        return now >= start_timestamp.getTime() && now <= end_timestamp.getTime();
      });
      await this.redisSource.update(latestDocuments);

      return Result.withContent(UpdateStatus.Success);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async update(
    leaderboard: Leaderboard
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    try {
      const { walletId, startTimestamp, endTimestamp } = leaderboard;
      const document = leaderboard.toDocument();
      await this.mongoSource.update(document, {
        where: {
          wallet_id: walletId,
          start_timestamp: startTimestamp,
          end_timestamp: endTimestamp,
        },
      });

      const now = Date.now();
      if (now >= startTimestamp.getTime() && now <= endTimestamp.getTime()) {
        //
        this.redisSource.update([document]);
      }

      return Result.withContent(UpdateStatus.Success);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async list(
    sort: MiningLeaderboardSort,
    offset: number,
    limit: number,
    order: MiningLeaderboardOrder,
    fromDate: Date,
    toDate: Date
  ): Promise<Result<Leaderboard[]>> {
    try {
      const { mongoSource } = this;
      const documents = await mongoSource.find({
        filter: {
          $and: [
            {
              start_timestamp: { $gte: new Date(fromDate.toISOString()) },
            },
            {
              end_timestamp: { $lte: new Date(toDate.toISOString()) },
            },
          ],
        },
        options: {
          sort: JSON.parse(`{ "${sort}": ${order || -1} }`),
          skip: Number(offset),
          limit: Number(limit),
        },
      });

      const entities: Leaderboard[] = [];

      for (const document of documents) {
        const rank = await this.redisSource.getRank(document.wallet_id, sort);
        entities.push(Leaderboard.fromDocument(document, rank + 1));
      }

      return Result.withContent(entities);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async count(model: QueryModel): Promise<Result<number, Error>> {
    try {
      const params = getParams(model);
      const count = await this.mongoSource.count(params);

      return Result.withContent(count);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async completeUpdate(): Promise<Result<boolean, Error>> {
    try {
      const { modifiedCount } = await this.mongoSource.completeUpdate();

      return Result.withContent(modifiedCount > 0);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async revertUpdate(): Promise<Result<boolean, Error>> {
    try {
      const { deletedCount } = await this.mongoSource.revertUpdate();

      return Result.withContent(deletedCount > 0);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
