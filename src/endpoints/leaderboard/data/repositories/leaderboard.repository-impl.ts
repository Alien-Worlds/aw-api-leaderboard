import { Failure, Result } from '@alien-worlds/api-core';

import { Leaderboard } from './../../domain/entities/leaderboard';
import {
  MiningLeaderboardOrder,
  MiningLeaderboardSort,
} from '../../domain/mining-leaderboard.enums';
import { MiningLeaderboardRepository } from '../../domain/repositories/mining-leaderboard.repository';
import { LeaderboardMongoSource } from '../data-sources/leaderboard.mongo.source';
import { LeaderboardRedisSource } from '../data-sources/leaderboard.redis.source';
import { UserLeaderboardNotFoundError } from './../../domain/errors/user-leaderboard-not-found.error';

export class LeaderboardRepositoryImpl implements MiningLeaderboardRepository {
  constructor(
    protected readonly mongoSource: LeaderboardMongoSource,
    protected readonly redisSource: LeaderboardRedisSource
  ) { }

  public async findUser(
    username: string,
    walletId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<Result<Leaderboard, Error>> {
    try {
      const { mongoSource, redisSource } = this;
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
              $or: [
                {
                  wallet_id: walletId,
                },
              ],
            },
          ],
        },
      });

      if (document) {
        return Result.withContent(Leaderboard.fromDocument(document));
      }

      return Result.withFailure(
        Failure.fromError(new UserLeaderboardNotFoundError(username))
      );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async findAll(
    walletId: string,
  ): Promise<Result<Leaderboard[], Error>> {
    try {
      const { mongoSource, redisSource } = this;

      const documents = await mongoSource.find({
        filter: {
          wallet_id: walletId,
        },
      });

      if (documents.length) {
        return Result.withContent(documents.map(Leaderboard.fromDocument));
      }

      return Result.withFailure(
        Failure.fromError(new UserLeaderboardNotFoundError(walletId))
      );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async update(leaderboard: Leaderboard): Promise<Result<void>> {
    try {
      const { walletId, startTimestamp, endTimestamp } = leaderboard;
      await this.mongoSource.update(leaderboard.toDocument(), {
        where: {
          wallet_id: walletId,
          start_timestamp: startTimestamp,
          end_timestamp: endTimestamp,
        },
      });
      return Result.withoutContent();
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
      const { mongoSource, redisSource } = this;
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
          sort: JSON.parse(`{ "${sort}": ${order} }`),
          skip: Number(offset),
          limit: Number(limit),
        },
      });

      const docsres = documents.map((document, index) => {
        const position = Number(offset) + Number(index) + 1;
        return Leaderboard.fromDocument(document, position);
      });

      return Result.withContent(docsres);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
