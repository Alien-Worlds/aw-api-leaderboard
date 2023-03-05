import { injectable } from '@alien-worlds/api-core';
import { MiningLeaderboardRepository } from './mining-leaderboard.repository';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class MiningSeasonLeaderboardRepository extends MiningLeaderboardRepository {
  public static Token = 'MINING_SEASON_LEADERBOARD_REPOSITORY';
}
