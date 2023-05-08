import { ListLeaderboardOutput } from './models/list-leaderboard.output';
import { inject, injectable, Result, UpdateStatus } from '@alien-worlds/api-core';
import { FindUserInLeaderboardInput } from './models/find-user-in-leaderboard.input';
import { ListLeaderboardInput } from './models/list-leaderboard.input';
import { UpdateLeaderboardInput } from './models/update-leaderboard.input';
import { FindUserInLeaderboardUseCase } from './use-cases/find-user-in-leaderboard.use-case';
import { ListLeaderboardUseCase } from './use-cases/list-leaderboard.use-case';
import { CountLeaderboardUseCase } from './use-cases/count-leaderboard.use-case';
import { UpdateLeaderboardOutput } from './models/update-leaderboard.output';
import { FindUserInLeaderboardOutput } from './models/find-user-in-leaderboard.output';
import {
  GetAtomicAssetsUseCase,
  UpdateLeaderboardUseCase,
} from '@alien-worlds/alienworlds-api-common';
import { buildConfig } from '../../../config';

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
    @inject(GetAtomicAssetsUseCase.Token)
    private getAtomicAssetsUseCase: GetAtomicAssetsUseCase
  ) {}

  /*methods*/

  /**
   *
   * @returns {Promise<Result<Leaderboard[], Error>>}
   */
  public async list(input: ListLeaderboardInput): Promise<ListLeaderboardOutput> {
    const listResult = await this.listLeaderboardUseCase.execute(input);
    const countResult = await this.countLeaderboardUseCase.execute(input);

    return ListLeaderboardOutput.create(
      listResult,
      countResult,
      input.sort,
      input.order,
      config.tlmDecimalPrecision
    );
  }
  /**
   *
   * @returns {Promise<Result<Leaderboard, Error>>}
   */
  public async findUser(
    input: FindUserInLeaderboardInput
  ): Promise<FindUserInLeaderboardOutput> {
    const result = await this.findUserInLeaderboardUseCase.execute(input);

    return FindUserInLeaderboardOutput.create(
      result,
      input.sort,
      config.tlmDecimalPrecision
    );
  }
  /**
   *
   * @returns {Promise<Result<UpdateStatus.Success | UpdateStatus.Failure, Error>>}
   */
  public async update(input: UpdateLeaderboardInput): Promise<UpdateLeaderboardOutput> {
    const { items: updates } = input;

    if (updates.length === 0) {
      return UpdateLeaderboardOutput.create(Result.withContent(UpdateStatus.Failure));
    }

    const assetIds = updates.reduce((list, update) => {
      if (update.bagItems) {
        list.push(...update.bagItems);
      }
      return list;
    }, []);

    const assetsResult = await this.getAtomicAssetsUseCase.execute(assetIds, 10);

    if (assetsResult.isFailure) {
      return UpdateLeaderboardOutput.create(Result.withFailure(assetsResult.failure));
    }

    const result = await this.updateLeaderboardUseCase.execute(
      updates,
      assetsResult.content
    );

    return UpdateLeaderboardOutput.create(result);
  }
}
