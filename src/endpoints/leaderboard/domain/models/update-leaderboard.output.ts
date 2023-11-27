import { log, OperationStatus, Result } from '@alien-worlds/aw-core';

export class UpdateLeaderboardOutput {
  public static create(
    result: Result<OperationStatus.Success | OperationStatus.Failure>
  ): UpdateLeaderboardOutput {
    return new UpdateLeaderboardOutput(result);
  }

  private constructor(
    public readonly result: Result<OperationStatus.Success | OperationStatus.Failure>
  ) { }

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
