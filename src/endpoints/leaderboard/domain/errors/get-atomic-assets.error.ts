export class GetAtomicAssetsError extends Error {
  constructor(failedFetchCount: number, parialFetchCount: number) {
    super(
      `Fetching atomic assets failed: failed fetch: ${failedFetchCount} | partial fetch: ${parialFetchCount}`
    );
  }
}
