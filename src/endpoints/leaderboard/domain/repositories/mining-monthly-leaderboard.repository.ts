import { injectable } from '@alien-worlds/api-core';
import { MiningLeaderboardRepository } from './mining-leaderboard.repository';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class MiningMonthlyLeaderboardRepository extends MiningLeaderboardRepository {
  public static Token = 'MINING_MONTHLY_LEADERBOARD_REPOSITORY';
}
