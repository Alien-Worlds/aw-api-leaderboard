import { Result, injectable, Repository } from '@alien-worlds/api-core';

import { Leaderboard } from '../entities/leaderboard';
import { MiningLeaderboardOrder } from '../mining-leaderboard.enums';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class MiningLeaderboardRepository extends Repository {
  public abstract list(
    sort: string,
    offset: number,
    limit: number,
    order: MiningLeaderboardOrder,
    fromDate: Date,
    toDate: Date
  ): Promise<Result<Leaderboard[]>>;

  public abstract findUser(
    username: string,
    walletId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<Result<Leaderboard>>;

  public abstract findAll(
    walletId: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Result<Leaderboard[]>>;
}
