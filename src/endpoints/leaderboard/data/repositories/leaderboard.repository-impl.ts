import {
  Failure,
  getParams,
  QueryModel,
  Result,
  UpdateStatus,
} from '@alien-worlds/api-core';

import { Leaderboard } from '../../domain/entities/leaderboard';
import { LeaderboardMongoSource } from '../data-sources/leaderboard.mongo.source';
import { LeaderboardRedisSource } from '../data-sources/leaderboard.redis.source';
import { MiningLeaderboardRepository } from '../../domain/repositories/mining-leaderboard.repository';
import {
  MiningLeaderboardSort,
  MiningLeaderboardOrder,
} from '../../domain/mining-leaderboard.enums';
import { UserLeaderboardNotFoundError } from './../../domain/errors/user-leaderboard-not-found.error';

export class LeaderboardRepositoryImpl implements MiningLeaderboardRepository {
  constructor(
    protected readonly mongoSource: LeaderboardMongoSource,
    protected readonly redisSource: LeaderboardRedisSource
  ) {}

  public async findUsers(
    walletIds: string[],
    fromDate: Date,
    toDate: Date
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

      return Result.withContent(documents.map(Leaderboard.fromDocument));
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async findUser(
    user: string,
    fromDate: Date,
    toDate: Date
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

      if (document) {
        return Result.withContent(Leaderboard.fromDocument(document));
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
      await this.mongoSource.updateManyByWalletId(
        leaderboards.map(leaderboard => leaderboard.toDocument())
      );
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
      await this.mongoSource.update(leaderboard.toDocument(), {
        where: {
          wallet_id: walletId,
          start_timestamp: startTimestamp,
          end_timestamp: endTimestamp,
        },
      });
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
      return Result.withContent(
        documents.map((document, index) => {
          const position = Number(offset) + Number(index) + 1;
          return Leaderboard.fromDocument(document, position);
        })
      );
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
