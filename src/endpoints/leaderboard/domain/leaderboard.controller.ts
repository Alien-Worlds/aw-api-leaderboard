import { inject, injectable, Result } from '@alien-worlds/api-core';

import { Leaderboard } from './entities/leaderboard';
import { FindUserInLeaderboardInput } from './models/find-user-in-leaderboard.input';
import { ListLeaderboardInput } from './models/list-leaderboard.input';
import { UpdateLeaderboardInput } from './models/update-leaderboard.input';
import { FindUserInLeaderboardUseCase } from './use-cases/find-user-in-leaderboard.use-case';
import { ListLeaderboardUseCase } from './use-cases/list-leaderboard.use-case';
import { UpdateLeaderboardUseCase } from './use-cases/update-leaderboard.use-case';

/*imports*/

/**
 * @class
 */
@injectable()
export class LeaderboardController {
  public static Token = 'LEADERBOARD_CONTROLLER';
  constructor(
    @inject(ListLeaderboardUseCase.Token)
    private listLeaderboardUseCase: ListLeaderboardUseCase,

    @inject(UpdateLeaderboardUseCase.Token)
    private updateLeaderboardUseCase: UpdateLeaderboardUseCase,

    @inject(FindUserInLeaderboardUseCase.Token)
    private findUserInLeaderboardUseCase: FindUserInLeaderboardUseCase
  ) {}

  /*methods*/

  /**
   *
   * @returns {Promise<Result<Leaderboard[], Error>>}
   */
  public async list(input: ListLeaderboardInput): Promise<Result<Leaderboard[], Error>> {
    return this.listLeaderboardUseCase.execute(input);
  }
  /**
   *
   * @returns {Promise<Result<Leaderboard, Error>>}
   */
  public async findUser(
    input: FindUserInLeaderboardInput
  ): Promise<Result<Leaderboard, Error>> {
    return this.findUserInLeaderboardUseCase.execute(input);
  }
  /**
   *
   * @returns {Promise<Result<void, Error>>}
   */
  public async update(input: UpdateLeaderboardInput): Promise<Result<void, Error>> {
    return this.updateLeaderboardUseCase.execute(input);
  }
}
