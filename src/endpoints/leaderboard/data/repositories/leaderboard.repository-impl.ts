import { Failure, MongoSource, Result } from '@alien-worlds/api-core';
import { MiningLeaderboardSort } from '../../domain/mining-leaderboard.enums';
import { MiningLeaderboardRepository } from '../../domain/repositories/mining-leaderboard.repository';
import { LeaderboardMongoSource } from '../data-sources/leaderboard.mongo.source';
import { LeaderboardRedisSource } from '../data-sources/leaderboard.redis.source';
import { Leaderboard } from './../../domain/entities/leaderboard';

export class LeaderboardRepositoryImpl implements MiningLeaderboardRepository {
  constructor(
    protected readonly mongoSource: LeaderboardMongoSource,
    protected readonly redisSource: LeaderboardRedisSource
  ) { }
  
  public findUser(username: string, walletId: string, fromDate: Date, toDate: Date): Promise<Result<Leaderboard, Error>> {
    throw new Error('Method not implemented.');
  }

  public async add(leaderboard: Leaderboard): Promise<Result<void>> {
    try {
      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async list(
    sort: MiningLeaderboardSort,
    offset: number,
    limit: number
  ): Promise<Result<Leaderboard[]>> {
    try {
      const { mongoSource, redisSource } = this;
      
      return Result.withContent([]);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
