export class AtomicAssetsPartialFetchError extends Error {
  constructor(fetched: number, total: number) {
    super(`Incomplete atomic assets download: ${fetched}/${total}`);
  }
}
