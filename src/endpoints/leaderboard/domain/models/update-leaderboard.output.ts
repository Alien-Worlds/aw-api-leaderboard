import { log, Result, UpdateStatus } from '@alien-worlds/api-core';

export class UpdateLeaderboardOutput {
  public static create(
    result: Result<UpdateStatus.Success | UpdateStatus.Failure>
  ): UpdateLeaderboardOutput {
    return new UpdateLeaderboardOutput(result);
  }

  private constructor(
    public readonly result: Result<UpdateStatus.Success | UpdateStatus.Failure>
  ) {}

  public toResponse() {
    const { result } = this;
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      log(error);
      return {
        status: 500,
        body: false,
      };
    }

    return {
      status: 200,
      body: true,
    };
  }
}
