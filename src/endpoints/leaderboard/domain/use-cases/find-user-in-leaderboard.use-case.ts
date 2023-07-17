import { Failure, inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { FindUserInLeaderboardInput } from '../models/find-user-in-leaderboard.input';
import { UserLeaderboardNotFoundError } from '../errors/user-leaderboard-not-found.error';
import {
  DailyLeaderboardRepository,
  Leaderboard,
  LeaderboardTimeframe,
  MonthlyLeaderboardRepository,
  WeeklyLeaderboardRepository,
} from '@alien-worlds/leaderboard-api-common';

/*imports*/
/**
 * @class
 */
@injectable()
export class FindUserInLeaderboardUseCase implements UseCase<Leaderboard> {
  public static Token = 'FIND_USER_IN_LEADERBOARD_USE_CASE';

  constructor(
    @inject(DailyLeaderboardRepository.Token)
    private dailyLeaderboardRepository: DailyLeaderboardRepository,
    @inject(WeeklyLeaderboardRepository.Token)
    private weeklyLeaderboardRepository: WeeklyLeaderboardRepository,
    @inject(MonthlyLeaderboardRepository.Token)
    private monthlyLeaderboardRepository: MonthlyLeaderboardRepository
  ) {}

  /**
   * @async
   * @returns {Promise<Result<Leaderboard>>}
   */
  public async execute(input: FindUserInLeaderboardInput): Promise<Result<Leaderboard>> {
    const { user, fromDate, toDate, timeframe } = input;
    let usersSearch: Result<Leaderboard[]>;
    if (timeframe === LeaderboardTimeframe.Daily) {
      usersSearch = await this.dailyLeaderboardRepository.findUsers(
        [user],
        true,
        fromDate,
        toDate
      );
    } else if (timeframe === LeaderboardTimeframe.Weekly) {
      usersSearch = await this.weeklyLeaderboardRepository.findUsers(
        [user],
        true,
        fromDate,
        toDate
      );
    } else if (timeframe === LeaderboardTimeframe.Monthly) {
      usersSearch = await this.monthlyLeaderboardRepository.findUsers(
        [user],
        true,
        fromDate,
        toDate
      );
    } else {
      return Result.withFailure(Failure.withMessage(`Unhandled timeframe ${timeframe}`));
    }

    if (usersSearch.isFailure) {
      return Result.withFailure(usersSearch.failure);
    }

    if (!usersSearch.content.length) {
      return Result.withFailure(
        Failure.fromError(new UserLeaderboardNotFoundError(user))
      );
    }

    return Result.withContent(usersSearch.content[0]);
  }

  /*methods*/
}
