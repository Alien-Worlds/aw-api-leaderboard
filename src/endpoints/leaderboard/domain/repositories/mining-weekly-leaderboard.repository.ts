import { injectable } from '@alien-worlds/api-core';
import { MiningLeaderboardRepository } from './mining-leaderboard.repository';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class MiningWeeklyLeaderboardRepository extends MiningLeaderboardRepository {
  public static Token = 'MINING_WEEKKLY_LEADERBOARD_REPOSITORY';
}
