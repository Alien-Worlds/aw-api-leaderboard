import { injectable, Result } from '@alien-worlds/api-core';
import { Leaderboard } from '../entities/leaderboard';
import { MiningLeaderboardSort } from '../mining-leaderboard.enums';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class MiningLeaderboardRepository {
  public abstract add(leaderboard: Leaderboard): Promise<Result<void>>;
  public abstract list(
    sort: MiningLeaderboardSort,
    offset: number,
    limit: number
  ): Promise<Result<Leaderboard[]>>;
  public abstract findUser(
    username: string,
    walletId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<Result<Leaderboard>>;
}
