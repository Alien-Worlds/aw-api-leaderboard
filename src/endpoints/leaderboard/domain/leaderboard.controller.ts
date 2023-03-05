import { ListLeaderboardOutput } from './models/list-leaderboard.output';
import { inject, injectable, Result } from '@alien-worlds/api-core';
import { ListLeaderboardInput } from './models/list-leaderboard.input';
import { FindUserInLeaderboardUseCase } from './use-cases/find-user-in-leaderboard.use-case';
import { ListLeaderboardUseCase } from './use-cases/list-leaderboard.use-case';
import { UpdateLeaderboardUseCase } from './use-cases/update-leaderboard.use-case';
import { FindUserInLeaderboardInput } from './models/find-user-in-leaderboard.input';
import { FindUserInLeaderboardOutput } from './models/find-user-in-leaderboard.output';
import { UpdateLeaderboardInput } from './models/update-leaderboard.input';
import { UpdateLeaderboardOutput } from './models/update-leaderboard.output';

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
   * @returns {Promise<Result<ListLeaderboardOutput, Error>>}
   */
  public async list(
    input: ListLeaderboardInput
  ): Promise<Result<ListLeaderboardOutput, Error>> {
    const result = await this.listLeaderboardUseCase.execute(input);
    return Result.withContent(ListLeaderboardOutput.create(result));
  }
  /**
   *
   * @returns {Promise<Result<FindUserInLeaderboardOutput, Error>>}
   */
  public async findUser(
    input: FindUserInLeaderboardInput
  ): Promise<Result<FindUserInLeaderboardOutput, Error>> {
    const result = await this.findUserInLeaderboardUseCase.execute(input);

    return Result.withContent(FindUserInLeaderboardOutput.create(result));
  }
  /**
   *
   * @returns {Promise<Result<UpdateLeaderboardOutput, Error>>}
   */
  public async update(
    input: UpdateLeaderboardInput
  ): Promise<Result<UpdateLeaderboardOutput, Error>> {
    const result = await this.updateLeaderboardUseCase.execute(input);

    return Result.withContent(UpdateLeaderboardOutput.create(result));
  }
}
