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
    items: LeaderboardUpdate[]
  ): Promise<Result<Map<string, AtomicAsset[]>>> {
    const assetsByItem = new Map<string, AtomicAsset[]>();
    let fetchFailureCount = 0;
    let partialFetchCount = 0;

    for (const item of items) {
      const { content: assets, failure: atomicAssetsFailure } =
        await this.atomicAssetRepository.getAssets(item.bagItems);

      if (atomicAssetsFailure) {
        log(atomicAssetsFailure.error);
        assetsByItem.set(item.id, []);
        fetchFailureCount++;
        continue;
      }

      if (assets.length < item.bagItems.length) {
        log(
          new AtomicAssetsPartialFetchError(assets.length, item.bagItems.length).message
        );
        assetsByItem.set(item.id, []);
        partialFetchCount++;
        continue;
      }

      assetsByItem.set(item.id, assets);
    }

    return fetchFailureCount + partialFetchCount < items.length
      ? Result.withContent(assetsByItem)
      : Result.withFailure(
          Failure.fromError(
            new GetAtomicAssetsError(fetchFailureCount, partialFetchCount)
          )
        );
  }
  /*methods*/
}
