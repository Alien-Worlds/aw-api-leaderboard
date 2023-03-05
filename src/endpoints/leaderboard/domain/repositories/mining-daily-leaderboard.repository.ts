import { injectable } from '@alien-worlds/api-core';
import { MiningLeaderboardRepository } from './mining-leaderboard.repository';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class MiningDailyLeaderboardRepository extends MiningLeaderboardRepository {
  public static Token = 'MINING_DAILY_LEADERBOARD_REPOSITORY';
}
