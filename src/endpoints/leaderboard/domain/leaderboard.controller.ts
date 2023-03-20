import { ListLeaderboardOutput } from './models/list-leaderboard.output';
import { inject, injectable, Result, UpdateStatus } from '@alien-worlds/api-core';
import { buildConfig } from '../../../config';
import { FindUserInLeaderboardInput } from './models/find-user-in-leaderboard.input';
import { ListLeaderboardInput } from './models/list-leaderboard.input';
import { UpdateLeaderboardInput } from './models/update-leaderboard.input';
import { CacheOrSendLeaderboardUseCase } from './use-cases/cache-or-send-leaderboard.use-case';
import { FindUserInLeaderboardUseCase } from './use-cases/find-user-in-leaderboard.use-case';
import { ListLeaderboardUseCase } from './use-cases/list-leaderboard.use-case';
import { UpdateLeaderboardUseCase } from './use-cases/update-leaderboard.use-case';
import { CountLeaderboardUseCase } from './use-cases/count-leaderboard.use-case';
import { UpdateLeaderboardOutput } from './models/update-leaderboard.output';
import { FindUserInLeaderboardOutput } from './models/find-user-in-leaderboard.output';

/*imports*/

const config = buildConfig();

/**
 * @class
 */
@injectable()
export class LeaderboardController {
  public static Token = 'LEADERBOARD_CONTROLLER';
  constructor(
    @inject(ListLeaderboardUseCase.Token)
    private listLeaderboardUseCase: ListLeaderboardUseCase,
    @inject(CountLeaderboardUseCase.Token)
    private countLeaderboardUseCase: CountLeaderboardUseCase,
    @inject(UpdateLeaderboardUseCase.Token)
    private updateLeaderboardUseCase: UpdateLeaderboardUseCase,
    @inject(FindUserInLeaderboardUseCase.Token)
    private findUserInLeaderboardUseCase: FindUserInLeaderboardUseCase,
    @inject(CacheOrSendLeaderboardUseCase.Token)
    private cacheOrSendLeaderboardUseCase: CacheOrSendLeaderboardUseCase
  ) {}

  /*methods*/

  /**
   *
   * @returns {Promise<Result<Leaderboard[], Error>>}
   */
  public async list(input: ListLeaderboardInput): Promise<ListLeaderboardOutput> {
    const listResult = await this.listLeaderboardUseCase.execute(input);
    const countResult = await this.countLeaderboardUseCase.execute(input);

    return ListLeaderboardOutput.create(listResult, countResult);
  }
  /**
   *
   * @returns {Promise<Result<Leaderboard, Error>>}
   */
  public async findUser(
    input: FindUserInLeaderboardInput
  ): Promise<FindUserInLeaderboardOutput> {
    const result = await this.findUserInLeaderboardUseCase.execute(input);

    return FindUserInLeaderboardOutput.create(result);
  }
  /**
   *
   * @returns {Promise<Result<UpdateStatus.Success | UpdateStatus.Failure, Error>>}
   */
  public async update(input: UpdateLeaderboardInput): Promise<UpdateLeaderboardOutput> {
    const { items } = input;
    let result: Result<UpdateStatus.Success | UpdateStatus.Failure>;

    if (config.updatesBatchSize) {
      result = await this.cacheOrSendLeaderboardUseCase.execute(items);
    }

    result = await this.updateLeaderboardUseCase.execute(items);

    return UpdateLeaderboardOutput.create(result);
  }
}
