export class AtomicAssetsPartialFetchError extends Error {
  constructor(fetched: number, total: number) {
    super(`Not all assets have been received: ${fetched}/${total}`);
  }
}
