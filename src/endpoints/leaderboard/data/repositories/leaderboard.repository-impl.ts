import { UserLeaderboardNotFoundError } from './../../domain/errors/user-leaderboard-not-found.error';
import { Failure, Result } from '@alien-worlds/api-core';
import { MiningLeaderboardSort } from '../../domain/mining-leaderboard.enums';
import { MiningLeaderboardRepository } from '../../domain/repositories/mining-leaderboard.repository';
import { LeaderboardMongoSource } from '../data-sources/leaderboard.mongo.source';
import { LeaderboardRedisSource } from '../data-sources/leaderboard.redis.source';
import { Leaderboard } from './../../domain/entities/leaderboard';

export class LeaderboardRepositoryImpl implements MiningLeaderboardRepository {
  constructor(
    protected readonly mongoSource: LeaderboardMongoSource,
    protected readonly redisSource: LeaderboardRedisSource
  ) {}

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
              start_timestamp: { $gte: fromDate },
            },
            {
              end_timestamp: { $lt: toDate },
            },
            {
              $or: [
                {
                  wallet_id: walletId,
                },
                {
                  username,
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
    fromDate: Date,
    toDate: Date
  ): Promise<Result<Leaderboard[]>> {
    try {
      const { mongoSource, redisSource } = this;
      const documents = await mongoSource.find({
        filter: {
          $and: [
            {
              start_timestamp: { $gte: fromDate },
            },
            {
              end_timestamp: { $lt: toDate },
            },
          ],
        },
        options: {
          sort: JSON.parse(`{ ${sort}: -1 }`),
          skip: offset,
          limit,
        },
      });
      return Result.withContent(documents.map(Leaderboard.fromDocument));
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
