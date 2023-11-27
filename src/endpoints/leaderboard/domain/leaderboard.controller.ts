import { AtomicAsset, GetAtomicAssetsUseCase } from '@alien-worlds/aw-api-common-atomicassets';
import { MinigToolData, UpdateLeaderboardUseCase } from '@alien-worlds/aw-api-common-leaderboard';
import { inject, injectable, OperationStatus, Result } from '@alien-worlds/aw-core';

import { LeaderboardApiConfig } from '../../../config';
import { FindUserInLeaderboardInput } from './models/find-user-in-leaderboard.input';
import { FindUserInLeaderboardOutput } from './models/find-user-in-leaderboard.output';
import { ListLeaderboardInput } from './models/list-leaderboard.input';
import { ListLeaderboardOutput } from './models/list-leaderboard.output';
import { UpdateLeaderboardInput } from './models/update-leaderboard.input';
import { UpdateLeaderboardOutput } from './models/update-leaderboard.output';
import { CountLeaderboardUseCase } from './use-cases/count-leaderboard.use-case';
import { FindUserInLeaderboardUseCase } from './use-cases/find-user-in-leaderboard.use-case';
import { ListLeaderboardUseCase } from './use-cases/list-leaderboard.use-case';

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
    @inject(CountLeaderboardUseCase.Token)
    private countLeaderboardUseCase: CountLeaderboardUseCase,
    @inject(UpdateLeaderboardUseCase.Token)
    private updateLeaderboardUseCase: UpdateLeaderboardUseCase,
    @inject(FindUserInLeaderboardUseCase.Token)
    private findUserInLeaderboardUseCase: FindUserInLeaderboardUseCase,
    @inject(GetAtomicAssetsUseCase.Token)
    private getAtomicAssetsUseCase: GetAtomicAssetsUseCase,
    @inject('CONFIG')
    private config: LeaderboardApiConfig
  ) { }

  /*methods*/

  /**
   *
   * @returns {Promise<ListLeaderboardOutput>}
   */
  public async list(input: ListLeaderboardInput): Promise<ListLeaderboardOutput> {
    const { config } = this;
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
   * @returns {Promise<FindUserInLeaderboardOutput>}
   */
  public async findUser(
    input: FindUserInLeaderboardInput
  ): Promise<FindUserInLeaderboardOutput> {
    const { config } = this;
    const result = await this.findUserInLeaderboardUseCase.execute(input);
    return FindUserInLeaderboardOutput.create(
      result,
      input.sort,
      config.tlmDecimalPrecision
    );
  }
  /**
   *
   * @returns {Promise<UpdateLeaderboardOutput>}
   */
  public async update(input: UpdateLeaderboardInput): Promise<UpdateLeaderboardOutput> {
    const { items: updates } = input;

    if (updates.length === 0) {
      return UpdateLeaderboardOutput.create(Result.withContent(OperationStatus.Failure));
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
      assetsResult.content as AtomicAsset<MinigToolData>[]
    );

    return UpdateLeaderboardOutput.create(result);
  }
}
