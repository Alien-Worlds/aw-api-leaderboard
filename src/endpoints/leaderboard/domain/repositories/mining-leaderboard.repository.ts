import { Result, injectable, UpdateStatus } from '@alien-worlds/api-core';

import { Leaderboard } from '../entities/leaderboard';
import { MiningLeaderboardOrder } from '../mining-leaderboard.enums';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class MiningLeaderboardRepository {
  public abstract list(
    sort: string,
    offset: number,
    limit: number,
    order: MiningLeaderboardOrder,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Result<Leaderboard[]>>;

  public abstract findUsers(
    walletIds: string[],
    fromDate?: Date,
    toDate?: Date
  ): Promise<Result<Leaderboard[], Error>>;

  public abstract update(
    leaderboards: Leaderboard[]
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>>;

  public abstract count(fromDate?: Date, toDate?: Date): Promise<Result<number>>;
  public abstract archive(): Promise<Result<boolean>>;
}
