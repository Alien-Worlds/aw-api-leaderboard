import { Result, injectable } from '@alien-worlds/api-core';

import { Leaderboard } from '../entities/leaderboard';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class MiningLeaderboardRepository {
  public abstract update(leaderboard: Leaderboard): Promise<Result<void>>;

  public abstract list(
    sort: string,
    offset: number,
    limit: number,
    fromDate: Date,
    toDate: Date
  ): Promise<Result<Leaderboard[]>>;

  public abstract findUser(
    username: string,
    walletId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<Result<Leaderboard>>;

  public abstract updateMany(leaderboards: Leaderboard[]): Promise<Result<void>>;
}
