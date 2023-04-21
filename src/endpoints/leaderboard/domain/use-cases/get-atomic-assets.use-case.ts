import { AtomicAsset, AtomicAssetRepository } from '@alien-worlds/alienworlds-api-common';
import {
  Failure,
  inject,
  injectable,
  log,
  Result,
  UseCase,
} from '@alien-worlds/api-core';
import { AtomicAssetsPartialFetchError } from '../errors/atomic-assets-partial-fetch.error';
import { GetAtomicAssetsError } from '../errors/get-atomic-assets.error';
import { LeaderboardUpdate } from '../models/update-leaderboard.input';

/*imports*/
/**
 * @class
 */
@injectable()
export class GetAtomicAssetsUseCase implements UseCase<Map<string, AtomicAsset[]>> {
  public static Token = 'GET_ATOMIC_ASSETS_USE_CASE';

  constructor(
    @inject(AtomicAssetRepository.Token)
    private atomicAssetRepository: AtomicAssetRepository
  ) {}

  /**
   * @async
   */
  public async execute(
    updates: LeaderboardUpdate[]
  ): Promise<Result<Map<string, AtomicAsset[]>>> {
    const assetsByItem = new Map<string, AtomicAsset[]>();
    let fetchFailureCount = 0;
    let partialFetchCount = 0;

    for (const update of updates) {
      const { content: assets, failure: atomicAssetsFailure } =
        await this.atomicAssetRepository.getAssets(update.bagItems);

      if (atomicAssetsFailure) {
        log(atomicAssetsFailure.error);
        assetsByItem.set(update.id, []);
        fetchFailureCount++;
        continue;
      }

      if (assets.length < update.bagItems.length) {
        log(
          new AtomicAssetsPartialFetchError(assets.length, update.bagItems.length).message
        );
        assetsByItem.set(update.id, []);
        partialFetchCount++;
        continue;
      }

      assetsByItem.set(update.id, assets);
    }

    return fetchFailureCount + partialFetchCount < updates.length
      ? Result.withContent(assetsByItem)
      : Result.withFailure(
          Failure.fromError(
            new GetAtomicAssetsError(fetchFailureCount, partialFetchCount)
          )
        );
  }
  /*methods*/
}
